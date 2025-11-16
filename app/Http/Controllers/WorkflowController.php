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

        // Dispatch after response - job starts immediately after response is sent
        // This allows polling to track progress without blocking the HTTP request
        RunWorkflow::dispatchAfterResponse($latestVersion);

        return response()->json([
            'message' => 'Workflow execution started.',
            'workflow' => $workflow->load([
                'versions' => fn ($query) => $query->orderByDesc('version'),
                'runs' => fn ($query) => $query->latest()->limit(5),
            ]),
        ]);
    }
}
