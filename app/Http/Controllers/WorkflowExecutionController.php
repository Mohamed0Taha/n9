<?php

namespace App\Http\Controllers;

use App\Models\Workflow;
use App\Models\WorkflowRun;

class WorkflowExecutionController extends Controller
{
    public function getLatestRun(Workflow $workflow)
    {
        $latestRun = $workflow->runs()
            ->orderByDesc('created_at')
            ->first();

        if (!$latestRun) {
            return response()->json([
                'run' => null,
                'message' => 'No execution found'
            ], 404);
        }

        return response()->json([
            'run' => $latestRun,
        ]);
    }
}
