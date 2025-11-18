<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckCredits
{
    /**
     * Handle an incoming request and check if user has enough credits
     */
    public function handle(Request $request, Closure $next, string $action): Response
    {
        $user = $request->user();

        // Guests must sign up first
        if (!$user) {
            return response()->json([
                'message' => 'Please sign in to continue',
                'action' => 'login_required',
                'reason' => 'credits_required',
            ], 401);
        }

        // Check if user has enough credits
        if (!$user->hasCredits($action)) {
            $cost = $user->getCreditCost($action);
            
            return response()->json([
                'message' => "Insufficient credits. You need {$cost} credits for this action.",
                'action' => 'insufficient_credits',
                'required_credits' => $cost,
                'current_balance' => $user->credit_balance,
                'pricing_key' => $action,
            ], 402); // 402 Payment Required
        }

        return $next($request);
    }
}
