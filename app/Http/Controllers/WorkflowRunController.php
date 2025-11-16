<?php

namespace App\Http\Controllers;

use App\Models\Workflow;

class WorkflowRunController extends Controller
{
    public function index(Workflow $workflow)
    {
        $runs = $workflow->runs()->latest()->limit(25)->get();

        return response()->json([
            'runs' => $runs,
        ]);
    }
}
