<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class CreditManagementController extends Controller
{
    /**
     * Add credits to a user
     */
    public function addCredits(Request $request, User $user)
    {
        if (!auth()->check() || !auth()->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
        ]);

        $user->addCredits(
            $validated['amount'],
            $validated['description'],
            'admin_adjustment'
        );

        \Log::info('Admin added credits', [
            'admin_user' => auth()->user()->email,
            'target_user' => $user->email,
            'amount' => $validated['amount'],
            'description' => $validated['description'],
        ]);

        return response()->json([
            'message' => 'Credits added successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'credit_balance' => (float) $user->fresh()->credit_balance,
            ],
        ]);
    }

    /**
     * Get user credit history
     */
    public function creditHistory(User $user)
    {
        if (!auth()->check() || !auth()->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $transactions = $user->creditTransactions()
            ->orderByDesc('created_at')
            ->limit(100)
            ->get();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'credit_balance' => (float) $user->credit_balance,
            ],
            'transactions' => $transactions,
        ]);
    }

    /**
     * Get all users with credit balance
     */
    public function listUsers(Request $request)
    {
        if (!auth()->check() || !auth()->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $users = User::select('id', 'name', 'email', 'credit_balance', 'created_at')
            ->orderByDesc('credit_balance')
            ->get();

        return response()->json(['users' => $users]);
    }
}
