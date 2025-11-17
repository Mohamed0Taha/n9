<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AiWorkflowGenerator;
use Illuminate\Http\Request;

class AiWorkflowController extends Controller
{
    public function __construct(
        private AiWorkflowGenerator $generator,
    ) {
    }

    public function __invoke(Request $request)
    {
        $data = $request->validate([
            'prompt' => ['required', 'string', 'max:1000'],
            'selectedNodes' => ['nullable', 'array'],
            'mode' => ['nullable', 'string', 'in:create,edit'],
        ]);

        $user = $request->user() ?? auth()->user() ?? User::first();

        if (!$user) {
            // Create organization first if it doesn't exist
            $organization = \App\Models\Organization::firstOrCreate(
                ['name' => 'Default Organization'],
                ['description' => 'Default organization for system users']
            );

            $user = User::firstOrCreate(
                ['email' => 'system@example.com'],
                [
                    'organization_id' => $organization->id,
                    'name' => 'System User',
                    'password' => bcrypt('password'),
                ]
            );
        }

        $payload = $this->generator->generate(
            $data['prompt'], 
            $user,
            $data['selectedNodes'] ?? null,
            $data['mode'] ?? 'create'
        );

        return response()->json($payload);
    }
}
