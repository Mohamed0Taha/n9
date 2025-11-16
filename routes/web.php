<?php

use App\Http\Controllers\AiWorkflowController;
use App\Http\Controllers\AppBootstrapController;
use App\Http\Controllers\SpaController;
use App\Http\Controllers\WorkflowController;
use App\Http\Controllers\WorkflowExecutionController;
use App\Http\Controllers\WorkflowRunController;
use Illuminate\Support\Facades\Route;

// Load HTTP test routes
require __DIR__.'/test-http.php';

Route::get('/', SpaController::class);

Route::prefix('app')->group(function () {
    Route::get('/bootstrap', AppBootstrapController::class);
    Route::post('/ai/generate', AiWorkflowController::class);
    Route::post('/workflows', [WorkflowController::class, 'store']);
    Route::patch('/workflows/{workflow}', [WorkflowController::class, 'update']);
    Route::post('/workflows/{workflow}/execute', [WorkflowController::class, 'execute']);
    Route::get('/workflows/{workflow}/execution', [WorkflowExecutionController::class, 'getLatestRun']);
    Route::get('/workflows/{workflow}/runs', [WorkflowRunController::class, 'index']);
});
