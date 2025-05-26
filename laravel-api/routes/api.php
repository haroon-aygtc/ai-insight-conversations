<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AIController;
use App\Http\Controllers\AIProviderController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public authentication routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication routes
    Route::prefix('auth')->group(function () {
        Route::get('user', [AuthController::class, 'user']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('logout-all-devices', [AuthController::class, 'logoutAllDevices']);
        Route::post('extend-session', [AuthController::class, 'extendSession']);
        Route::post('update-activity', [AuthController::class, 'updateActivity']);
        Route::post('refresh', [AuthController::class, 'refreshSession']);

        // Session management
        Route::get('sessions', [AuthController::class, 'getActiveSessions']);
        Route::delete('sessions/{sessionId}', [AuthController::class, 'terminateSession']);

        // Activity logging
        Route::post('log-activity', [AuthController::class, 'logActivity']);
        Route::get('activity-logs', [AuthController::class, 'getActivityLogs']);
    });

    // Legacy user route for backward compatibility
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // Form template routes
    Route::prefix('form-templates')->group(function () {
        Route::get('/', [App\Http\Controllers\FormTemplateController::class, 'index']);
        Route::get('/{template}', [App\Http\Controllers\FormTemplateController::class, 'show']);
        Route::get('/type/{type}/default', [App\Http\Controllers\FormTemplateController::class, 'getDefaultByType']);
    });

    // AI routes
    Route::prefix('ai')->group(function () {
        Route::get('/providers', [AIController::class, 'getProviders']);
        Route::post('/text', [AIController::class, 'generateText']);
        Route::post('/chat', [AIController::class, 'generateChat']);
        Route::post('/image', [AIController::class, 'generateImage']);
        Route::post('/embeddings', [AIController::class, 'generateEmbeddings']);

        // AI Provider Management
        Route::prefix('providers')->group(function () {
            Route::get('/', [AIProviderController::class, 'index']);
            Route::post('/', [AIProviderController::class, 'store']);
            Route::get('/{id}', [AIProviderController::class, 'show']);
            Route::put('/{id}', [AIProviderController::class, 'update']);
            Route::delete('/{id}', [AIProviderController::class, 'destroy']);
            Route::post('/{id}/default', [AIProviderController::class, 'setDefault']);
            Route::post('/{id}/test-connection', [AIProviderController::class, 'testConnection']);
            Route::get('/{id}/models', [AIProviderController::class, 'getModels']);
            Route::put('/{providerId}/models/{modelId}', [AIProviderController::class, 'updateModel']);
        });

        // AI Model Management
        Route::prefix('models')->group(function () {
            Route::get('/', [AIModelController::class, 'index']);
            Route::post('/', [AIModelController::class, 'store']);
            Route::get('/{id}', [AIModelController::class, 'show']);
            Route::put('/{id}', [AIModelController::class, 'update']);
            Route::delete('/{id}', [AIModelController::class, 'destroy']);
            Route::post('/{id}/default', [AIModelController::class, 'setDefault']);
            Route::post('/{id}/test', [AIModelController::class, 'testModel']);
            Route::get('/provider/{providerId}', [AIModelController::class, 'getProviderModels']);
        });

        // AI Configuration Management
        Route::prefix('config')->group(function () {
            Route::get('/', [AIConfigController::class, 'index']);
            Route::put('/', [AIConfigController::class, 'update']);
            Route::get('/fallbacks', [AIConfigController::class, 'getFallbacks']);
            Route::put('/fallbacks', [AIConfigController::class, 'updateFallbacks']);
            Route::get('/cache', [AIConfigController::class, 'getCache']);
            Route::put('/cache', [AIConfigController::class, 'updateCache']);
            Route::get('/rate-limits', [AIConfigController::class, 'getRateLimits']);
            Route::put('/rate-limits', [AIConfigController::class, 'updateRateLimits']);
        });

        // AI Prompt Template Management
        Route::prefix('prompts')->group(function () {
            Route::get('/', [AIPromptTemplateController::class, 'index']);
            Route::post('/', [AIPromptTemplateController::class, 'store']);
            Route::get('/{id}', [AIPromptTemplateController::class, 'show']);
            Route::put('/{id}', [AIPromptTemplateController::class, 'update']);
            Route::delete('/{id}', [AIPromptTemplateController::class, 'destroy']);
            Route::post('/{id}/render', [AIPromptTemplateController::class, 'render']);
        });
    });

    // Widget routes
    Route::get('/widgets', [App\Http\Controllers\WidgetController::class, 'index']);
    Route::post('/widgets', [App\Http\Controllers\WidgetController::class, 'store']);
    Route::get('/widgets/{id}', [App\Http\Controllers\WidgetController::class, 'show']);
    Route::put('/widgets/{id}', [App\Http\Controllers\WidgetController::class, 'update']);
    Route::delete('/widgets/{id}', [App\Http\Controllers\WidgetController::class, 'destroy']);
    Route::post('/widgets/{id}/publish', [App\Http\Controllers\WidgetController::class, 'publish']);
    Route::post('/widgets/{id}/unpublish', [App\Http\Controllers\WidgetController::class, 'unpublish']);
    Route::get('/widgets/{id}/embed-code', [App\Http\Controllers\WidgetController::class, 'getEmbedCode']);
});

// Public widget routes
Route::get('/widget/{widgetId}', [App\Http\Controllers\WidgetPublicController::class, 'show']);
Route::get('/widget/{widgetId}/script.js', [App\Http\Controllers\WidgetPublicController::class, 'script']);
Route::post('/widget/{widgetId}/chat', [App\Http\Controllers\WidgetPublicController::class, 'chat']);
Route::post('/widget/{widgetId}/analytics', [App\Http\Controllers\WidgetPublicController::class, 'recordAnalytics']);
