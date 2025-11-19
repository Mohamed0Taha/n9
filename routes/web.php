<?php

use App\Http\Controllers\Admin\CreditManagementController;
use App\Http\Controllers\Admin\PricingController;
use App\Http\Controllers\AiWorkflowController;
use App\Http\Controllers\AppBootstrapController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\SpaController;
use App\Http\Controllers\WorkflowController;
use App\Http\Controllers\WorkflowExecutionController;
use App\Http\Controllers\WorkflowRunController;
use Illuminate\Support\Facades\Route;

// Load HTTP test routes
require __DIR__.'/test-http.php';

Route::get('/', SpaController::class);

// Google OAuth routes
Route::prefix('auth')->group(function () {
    Route::get('/google', [GoogleAuthController::class, 'redirectToGoogle']);
    Route::get('/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);
    Route::post('/logout', [GoogleAuthController::class, 'logout']);
    Route::get('/user', [GoogleAuthController::class, 'user']);
});

Route::prefix('app')->group(function () {
    Route::get('/bootstrap', AppBootstrapController::class);
    Route::post('/ai/generate', AiWorkflowController::class);
    Route::post('/workflows', [WorkflowController::class, 'store']);
    Route::patch('/workflows/{workflow}', [WorkflowController::class, 'update']);
    Route::post('/workflows/{workflow}/execute', [WorkflowController::class, 'execute']);
    Route::get('/workflows/{workflow}/execution', [WorkflowExecutionController::class, 'getLatestRun']);
    Route::get('/workflows/{workflow}/runs', [WorkflowRunController::class, 'index']);
    
    // Workflow import/export routes
    Route::post('/workflows/upload', [\App\Http\Controllers\WorkflowImportExportController::class, 'upload']);
    Route::get('/workflows/{workflow}/download', [\App\Http\Controllers\WorkflowImportExportController::class, 'download']);
    Route::get('/workflows/{workflow}/preview', [\App\Http\Controllers\WorkflowImportExportController::class, 'preview']);

    // Credential management routes
    Route::middleware('auth')->prefix('credentials')->group(function () {
        Route::get('/', [\App\Http\Controllers\CredentialController::class, 'index']);
        Route::post('/', [\App\Http\Controllers\CredentialController::class, 'store']);
        Route::get('/{id}', [\App\Http\Controllers\CredentialController::class, 'show']);
        Route::put('/{id}', [\App\Http\Controllers\CredentialController::class, 'update']);
        Route::delete('/{id}', [\App\Http\Controllers\CredentialController::class, 'destroy']);
    });
});

// Debug route (remove after testing)
Route::get('/debug/google-config', function () {
    return response()->json([
        'client_id' => config('services.google.client_id'),
        'redirect_uri' => config('services.google.redirect'),
        'app_url' => config('app.url'),
        'env_redirect_uri' => env('GOOGLE_REDIRECT_URI'),
        'env_app_url' => env('APP_URL'),
    ]);
});

// Admin routes
Route::prefix('admin')->middleware('auth')->group(function () {
    Route::view('/', 'admin.dashboard');
    Route::get('/pricing', [PricingController::class, 'index']);
    Route::patch('/pricing/{pricing}', [PricingController::class, 'update']);
    Route::post('/pricing/{pricing}/toggle', [PricingController::class, 'toggleActive']);
    
    Route::get('/users', [CreditManagementController::class, 'listUsers']);
    Route::post('/users/{user}/credits', [CreditManagementController::class, 'addCredits']);
    Route::get('/users/{user}/credit-history', [CreditManagementController::class, 'creditHistory']);
});
