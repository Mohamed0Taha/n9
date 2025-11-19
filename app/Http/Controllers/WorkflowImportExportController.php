<?php

namespace App\Http\Controllers;

use App\Models\PricingConfig;
use App\Models\Workflow;
use App\Services\N8nFormatConverter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class WorkflowImportExportController extends Controller
{
    /**
     * Upload and import an n8n workflow
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:json|max:2048', // Max 2MB
        ]);

        try {
            $content = file_get_contents($request->file('file')->getRealPath());
            $n8nWorkflow = json_decode($content, true);

            if (!$n8nWorkflow) {
                return response()->json([
                    'message' => 'Invalid JSON file',
                ], 400);
            }

            // Validate n8n workflow structure
            if (!N8nFormatConverter::validateN8nWorkflow($n8nWorkflow)) {
                return response()->json([
                    'message' => 'Invalid n8n workflow format',
                ], 400);
            }

            // Convert to our format
            $converted = N8nFormatConverter::fromN8n($n8nWorkflow);

            Log::info('n8n workflow imported', [
                'name' => $converted['name'],
                'node_count' => count($converted['graph']['nodes'] ?? []),
            ]);

            return response()->json([
                'message' => 'Workflow imported successfully',
                'workflow' => $converted,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to import n8n workflow', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to import workflow: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Download workflow in n8n format (requires authentication and credits)
     */
    public function download(Request $request, Workflow $workflow)
    {
        // Check authentication
        if (!auth()->check()) {
            return response()->json([
                'message' => 'Authentication required',
            ], 401);
        }

        $user = auth()->user();

        // Get pricing
        $pricing = PricingConfig::where('key', 'workflow_download')
            ->where('is_active', true)
            ->first();

        if (!$pricing) {
            return response()->json([
                'message' => 'Workflow download is not available',
            ], 503);
        }

        // Check credit balance
        if ($user->credit_balance < $pricing->credit_cost) {
            return response()->json([
                'message' => 'Insufficient credits',
                'required_credits' => (float) $pricing->credit_cost,
                'current_balance' => (float) $user->credit_balance,
            ], 402);
        }

        // Deduct credits
        $user->deductCredits(
            $pricing->credit_cost,
            "Downloaded workflow: {$workflow->name}",
            'workflow_download'
        );

        // Get latest version
        $latestVersion = $workflow->versions()->latest()->first();

        if (!$latestVersion) {
            return response()->json([
                'message' => 'No workflow version found',
            ], 404);
        }

        // Convert to n8n format
        $n8nWorkflow = N8nFormatConverter::toN8n([
            'name' => $workflow->name,
            'description' => $workflow->description,
            'graph' => $latestVersion->graph,
        ]);

        Log::info('Workflow downloaded', [
            'user_id' => $user->id,
            'workflow_id' => $workflow->id,
            'credits_deducted' => $pricing->credit_cost,
        ]);

        // Return as downloadable JSON file
        $filename = Str::slug($workflow->name) . '.json';

        return response()->json($n8nWorkflow)
            ->header('Content-Disposition', "attachment; filename=\"{$filename}\"")
            ->header('Content-Type', 'application/json');
    }

    /**
     * Preview workflow in n8n format (no credits required)
     */
    public function preview(Request $request, Workflow $workflow)
    {
        $latestVersion = $workflow->versions()->latest()->first();

        if (!$latestVersion) {
            return response()->json([
                'message' => 'No workflow version found',
            ], 404);
        }

        // Convert to n8n format
        $n8nWorkflow = N8nFormatConverter::toN8n([
            'name' => $workflow->name,
            'description' => $workflow->description,
            'graph' => $latestVersion->graph,
        ]);

        return response()->json([
            'n8n_workflow' => $n8nWorkflow,
            'nodes_count' => count($n8nWorkflow['nodes']),
            'connections_count' => array_sum(array_map('count', $n8nWorkflow['connections'])),
        ]);
    }
}
