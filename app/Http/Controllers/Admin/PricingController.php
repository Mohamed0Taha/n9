<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PricingConfig;
use Illuminate\Http\Request;

class PricingController extends Controller
{
    /**
     * Get all pricing configurations
     */
    public function index()
    {
        if (!auth()->check() || !auth()->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $pricing = PricingConfig::orderBy('name')->get();
        
        return response()->json(['pricing' => $pricing]);
    }

    /**
     * Update pricing configuration
     */
    public function update(Request $request, PricingConfig $pricing)
    {
        if (!auth()->check() || !auth()->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'credit_cost' => 'required|numeric|min:0',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $pricing->update($validated);
        PricingConfig::clearCache();

        \Log::info('Pricing updated', [
            'admin_user' => auth()->user()->email,
            'pricing_key' => $pricing->key,
            'new_cost' => $validated['credit_cost'],
        ]);

        return response()->json([
            'message' => 'Pricing updated successfully',
            'pricing' => $pricing->fresh(),
        ]);
    }

    /**
     * Toggle pricing active status
     */
    public function toggleActive(PricingConfig $pricing)
    {
        if (!auth()->check() || !auth()->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $pricing->update(['is_active' => !$pricing->is_active]);
        PricingConfig::clearCache();

        return response()->json([
            'message' => 'Pricing status updated',
            'pricing' => $pricing->fresh(),
        ]);
    }
}
