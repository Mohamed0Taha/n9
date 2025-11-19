<?php

namespace App\Http\Controllers;

use App\Models\Credential;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CredentialController extends Controller
{
    /**
     * Display a listing of user's credentials
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $credentials = Credential::where('user_id', $user->id)
            ->select('id', 'name', 'type', 'created_at', 'updated_at')
            ->get();

        return response()->json(['credentials' => $credentials]);
    }

    /**
     * Store a new credential
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'data' => 'required|array',
        ]);

        try {
            $credential = Credential::create([
                'user_id' => $user->id,
                'name' => $validated['name'],
                'type' => $validated['type'],
                'data' => $validated['data'], // Will be encrypted automatically
            ]);

            Log::info('Credential created', [
                'credential_id' => $credential->id,
                'user_id' => $user->id,
                'type' => $validated['type']
            ]);

            return response()->json([
                'message' => 'Credential created successfully',
                'credential' => [
                    'id' => $credential->id,
                    'name' => $credential->name,
                    'type' => $credential->type,
                    'created_at' => $credential->created_at,
                ]
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to create credential', [
                'error' => $e->getMessage(),
                'user_id' => $user->id
            ]);
            
            return response()->json(['error' => 'Failed to create credential'], 500);
        }
    }

    /**
     * Display the specified credential (without sensitive data)
     */
    public function show($id)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $credential = Credential::where('user_id', $user->id)
            ->where('id', $id)
            ->select('id', 'name', 'type', 'created_at', 'updated_at')
            ->first();

        if (!$credential) {
            return response()->json(['error' => 'Credential not found'], 404);
        }

        return response()->json(['credential' => $credential]);
    }

    /**
     * Update the specified credential
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $credential = Credential::where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$credential) {
            return response()->json(['error' => 'Credential not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'data' => 'sometimes|array',
        ]);

        try {
            $credential->update($validated);

            Log::info('Credential updated', [
                'credential_id' => $credential->id,
                'user_id' => $user->id
            ]);

            return response()->json([
                'message' => 'Credential updated successfully',
                'credential' => [
                    'id' => $credential->id,
                    'name' => $credential->name,
                    'type' => $credential->type,
                    'updated_at' => $credential->updated_at,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update credential', [
                'error' => $e->getMessage(),
                'credential_id' => $id
            ]);
            
            return response()->json(['error' => 'Failed to update credential'], 500);
        }
    }

    /**
     * Remove the specified credential
     */
    public function destroy($id)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $credential = Credential::where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$credential) {
            return response()->json(['error' => 'Credential not found'], 404);
        }

        try {
            $credential->delete();

            Log::info('Credential deleted', [
                'credential_id' => $id,
                'user_id' => $user->id
            ]);

            return response()->json(['message' => 'Credential deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Failed to delete credential', [
                'error' => $e->getMessage(),
                'credential_id' => $id
            ]);
            
            return response()->json(['error' => 'Failed to delete credential'], 500);
        }
    }

    /**
     * Get decrypted credential data (for backend use only - not exposed to frontend)
     * This method is for internal use by workflow execution
     */
    public static function getCredentialData($credentialId, $userId)
    {
        $credential = Credential::where('id', $credentialId)
            ->where('user_id', $userId)
            ->first();

        return $credential ? $credential->data : null;
    }
}

