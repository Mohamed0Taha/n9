<?php

namespace App\Http\Controllers;

use App\Models\Connector;
use App\Models\Workflow;
use Illuminate\Http\Request;

class AppBootstrapController extends Controller
{
    public function __invoke(Request $request)
    {
        $organizationId = $request->user()?->organization_id ?? 1;

        $workflows = Workflow::with([
            'versions' => fn ($query) => $query->orderByDesc('version')->limit(3),
            'runs' => fn ($query) => $query->latest()->limit(5),
        ])
            ->where('organization_id', $organizationId)
            ->latest()
            ->get();

        $connectors = Connector::orderBy('category')->get();

        return response()->json([
            'workflows' => $workflows->map(fn ($workflow) => [
                'id' => $workflow->id,
                'name' => $workflow->name,
                'description' => $workflow->description,
                'status' => $workflow->status,
                'metadata' => $workflow->metadata,
                'versions' => $workflow->versions->map(fn ($version) => [
                    'id' => $version->id,
                    'version' => $version->version,
                    'graph' => $version->graph,
                    'created_at' => $version->created_at,
                ]),
                'runs' => $workflow->runs->map(fn ($run) => [
                    'id' => $run->id,
                    'status' => $run->status,
                    'started_at' => $run->started_at,
                    'finished_at' => $run->finished_at,
                ]),
            ]),
            'connectors' => $connectors,
        ]);
    }
}
