<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireAuthForSave
{
    /**
     * Routes that require authentication to save/persist data
     */
    protected array $protectedActions = [
        'workflows.update',  // Saving workflow changes
        'connectors.store',  // Adding credentials
        'connectors.update', // Updating credentials
    ];
    
    /**
     * Handle an incoming request
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Allow authenticated users
        if ($request->user()) {
            return $next($request);
        }
        
        // Check if this is a save/persist action
        $routeName = $request->route()?->getName();
        
        // Block saves for guests
        if ($this->isSaveAction($request, $routeName)) {
            return response()->json([
                'message' => 'Please sign up to save your work',
                'action' => 'signup_required',
                'reason' => 'saving_workflow'
            ], 403);
        }
        
        // Block credential management for guests
        if ($this->isCredentialAction($request, $routeName)) {
            return response()->json([
                'message' => 'Please sign up to add credentials',
                'action' => 'signup_required',
                'reason' => 'adding_credentials'
            ], 403);
        }
        
        return $next($request);
    }
    
    /**
     * Check if this is a save action
     */
    private function isSaveAction(Request $request, ?string $routeName): bool
    {
        // Check route name
        if ($routeName && str_contains($routeName, 'update')) {
            return true;
        }
        
        // Check for workflow save endpoints
        if ($request->is('app/workflows/*/update') || $request->is('app/workflows/*/save')) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Check if this is a credential action
     */
    private function isCredentialAction(Request $request, ?string $routeName): bool
    {
        // Check for connector/credential endpoints
        if ($request->is('app/connectors*')) {
            return true;
        }
        
        return false;
    }
}
