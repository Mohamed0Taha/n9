<?php

namespace App\Http\Controllers;

use App\Jobs\RunWorkflow;
use App\Models\Workflow;
use App\Models\WorkflowVersion;
use Illuminate\Http\Request;

class WorkflowController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'graph' => ['required', 'array'],
        ]);

        $user = $request->user() ?? auth()->user();
        $organizationId = $user?->organization_id ?? 1;

        $workflow = Workflow::create([
            'organization_id' => $organizationId,
            'user_id' => $user?->id ?? 1,
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'status' => 'draft',
            'metadata' => ['source' => 'ai'],
        ]);

        $versionNumber = 1;

        $version = WorkflowVersion::create([
            'workflow_id' => $workflow->id,
            'version' => $versionNumber,
            'graph' => $data['graph'],
            'ai_prompt' => $data['description'] ?? null,
            'created_by' => $user?->id ?? 1,
        ]);

        RunWorkflow::dispatchSync($version);

        return response()->json([
            'workflow' => $workflow->load([
                'versions' => fn ($query) => $query->orderByDesc('version'),
                'runs' => fn ($query) => $query->latest()->limit(5),
            ]),
        ]);
    }

    public function update(Request $request, Workflow $workflow)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'string'],
            'graph' => ['nullable', 'array'],
        ]);

        $workflow->fill($request->only('name', 'description', 'status'));
        
        // Extract schedule configuration from graph if present
        if (isset($data['graph'])) {
            $scheduleConfig = $this->extractScheduleConfig($data['graph']);
            if ($scheduleConfig) {
                $workflow->is_scheduled = true;
                $workflow->schedule_interval = $scheduleConfig['interval'];
                $workflow->schedule_timezone = $scheduleConfig['timezone'] ?? 'UTC';
                
                // Set initial next run time if not already set
                if (!$workflow->next_scheduled_run) {
                    $workflow->next_scheduled_run = \Carbon\Carbon::now($workflow->schedule_timezone);
                }
                
                \Log::info('Schedule configured for workflow', [
                    'workflow_id' => $workflow->id,
                    'interval' => $workflow->schedule_interval,
                    'timezone' => $workflow->schedule_timezone,
                    'next_run' => $workflow->next_scheduled_run,
                ]);
            } else {
                $workflow->is_scheduled = false;
                $workflow->schedule_interval = null;
                $workflow->next_scheduled_run = null;
            }
        }
        
        $workflow->save();

        if (isset($data['graph'])) {
            $latestVersion = $workflow->versions()->max('version') ?? 0;
            $version = WorkflowVersion::create([
                'workflow_id' => $workflow->id,
                'version' => $latestVersion + 1,
                'graph' => $data['graph'],
                'ai_prompt' => $data['description'] ?? $workflow->description,
                'created_by' => $request->user()?->id ?? 1,
            ]);
            RunWorkflow::dispatchSync($version);
        }

        return response()->json([
            'workflow' => $workflow->load([
                'versions' => fn ($query) => $query->orderByDesc('version'),
                'runs' => fn ($query) => $query->latest()->limit(5),
            ]),
        ]);
    }

    public function execute(Workflow $workflow)
    {
        $latestVersion = $workflow->versions()->orderByDesc('version')->first();

        if (!$latestVersion) {
            return response()->json([
                'message' => 'No workflow version found to execute.',
            ], 404);
        }

        // Execute immediately after response (Manual Trigger needs instant execution)
        // This starts the job right after sending the response, no worker needed
        \Log::info('Executing workflow after response', ['workflow_id' => $workflow->id, 'version_id' => $latestVersion->id]);
        RunWorkflow::dispatchAfterResponse($latestVersion);

        return response()->json([
            'message' => 'Workflow execution started.',
            'workflow' => $workflow->load([
                'versions' => fn ($query) => $query->orderByDesc('version'),
                'runs' => fn ($query) => $query->latest()->limit(5),
            ]),
        ]);
    }
    
    /**
     * Extract schedule configuration from workflow graph
     */
    private function extractScheduleConfig(array $graph): ?array
    {
        if (!isset($graph['nodes']) || !is_array($graph['nodes'])) {
            return null;
        }
        
        // Look for Schedule nodes in the graph
        foreach ($graph['nodes'] as $node) {
            $nodeName = $node['data']['name'] ?? $node['data']['label'] ?? null;
            $nodeType = $node['data']['type'] ?? $nodeName;
            
            if ($nodeName === 'Schedule' || $nodeType === 'Schedule') {
                $parameters = $node['data']['parameters'] ?? [];
                
                // Check if schedule is enabled
                if (isset($parameters['enabled']) && $parameters['enabled'] === false) {
                    return null;
                }
                
                return [
                    'interval' => $parameters['interval'] ?? 'Every Hour',
                    'timezone' => $parameters['timezone'] ?? 'UTC',
                    'startTime' => $parameters['startTime'] ?? null,
                    'dayOfWeek' => $parameters['dayOfWeek'] ?? null,
                    'dayOfMonth' => $parameters['dayOfMonth'] ?? null,
                ];
            }
        }
        
        return null;
    }
}
