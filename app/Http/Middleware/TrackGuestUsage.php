<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class TrackGuestUsage
{
    /**
     * Handle an incoming request and track guest user limitations
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip tracking for authenticated users
        if ($request->user()) {
            return $next($request);
        }
        
        // Initialize guest session data if not exists
        if (!session()->has('guest_session_start')) {
            session()->put('guest_session_start', now());
            session()->put('guest_workflow_count', 0);
            session()->put('guest_execution_count', 0);
            
            Log::info('New guest session started', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);
        }
        
        // Check session expiry (1 hour)
        $sessionStart = session('guest_session_start');
        $sessionAge = now()->diffInMinutes($sessionStart);
        
        if ($sessionAge >= 60) {
            Log::info('Guest session expired', [
                'duration_minutes' => $sessionAge,
                'workflows_created' => session('guest_workflow_count', 0),
                'executions' => session('guest_execution_count', 0)
            ]);
            
            // Store expiry flag
            session()->put('session_expired', true);
            session()->put('session_expired_at', now());
        }
        
        return $next($request);
    }
}
