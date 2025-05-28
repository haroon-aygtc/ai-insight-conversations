<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\AIProviderController;
use App\Http\Controllers\AIModelController;
use App\Http\Controllers\AIConfigController;
use App\Http\Controllers\AIPromptTemplateController;
use App\Http\Controllers\FormTemplateController;
use App\Http\Controllers\WidgetController;
use App\Http\Controllers\WidgetPublicController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Constants\Roles;

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
        Route::get('activity-logs', [AuthController::class, 'getActivityLogs'])
            ->middleware('permission:system.logs');
    });

    // Legacy user route for backward compatibility
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Read endpoints for common resources (available to all authenticated users)
    // Roles endpoints
    Route::get('/roles', [RoleController::class, 'index']);
    Route::get('/roles/permissions/all', [RoleController::class, 'getPermissions']);
    Route::get('/roles/{id}', [RoleController::class, 'show']);

    // Permissions endpoints
    Route::get('/permissions', [PermissionController::class, 'index']);
    Route::get('/permissions/{id}', [PermissionController::class, 'show']);
    Route::post('/permissions/check', [PermissionController::class, 'checkPermission']);
    Route::post('/permissions/check-multiple', [PermissionController::class, 'checkPermissions']);

    // Users endpoints
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/roles/all', [UserController::class, 'getRoles']);
    Route::get('/users/{id}', [UserController::class, 'show']);

    // Admin-only routes
    Route::middleware(['role:' . Roles::ADMIN . '|' . Roles::SUPER_ADMIN])->group(function () {
        // User Management Routes (write operations)
        Route::prefix('users')->group(function () {
            Route::post('/', [UserController::class, 'store'])
                ->middleware('permission:user.create');
            Route::put('/{id}', [UserController::class, 'update'])
                ->middleware('permission:user.edit');
            Route::delete('/{id}', [UserController::class, 'destroy'])
                ->middleware('permission:user.delete');
        });

        // Role write operations (admin only)
        Route::prefix('roles')->group(function () {
            Route::post('/', [RoleController::class, 'store'])
                ->middleware('permission:role.create');
            Route::put('/{id}', [RoleController::class, 'update'])
                ->middleware('permission:role.edit');
            Route::delete('/{id}', [RoleController::class, 'destroy'])
                ->middleware('permission:role.delete');
        });

        // Permission write operations (admin only)
        Route::prefix('permissions')->group(function () {
            Route::post('/', [PermissionController::class, 'store'])
                ->middleware('permission:permission.create');
            Route::put('/{id}', [PermissionController::class, 'update'])
                ->middleware('permission:permission.edit');
            Route::delete('/{id}', [PermissionController::class, 'destroy'])
                ->middleware('permission:permission.delete');
        });
    });


    // Form template routes
    Route::prefix('form-templates')->group(function () {
        Route::get('/', [FormTemplateController::class, 'index']);
        Route::get('/{template}', [FormTemplateController::class, 'show']);
        Route::get('/type/{type}/default', [FormTemplateController::class, 'getDefaultByType']);
    });

    // AI routes
    Route::prefix('ai')->group(function () {
        // Basic AI generation - requires ai.view permission
        Route::middleware('permission:ai.view')->group(function () {
            Route::get('/providers', [AIController::class, 'getProviders']);
            Route::post('/text', [AIController::class, 'generateText']);
            Route::post('/chat', [AIController::class, 'generateChat']);
            Route::post('/image', [AIController::class, 'generateImage']);
            Route::post('/embeddings', [AIController::class, 'generateEmbeddings']);
        });

        // AI Provider Management - requires ai.manage permission
        Route::prefix('providers')->middleware('permission:ai.manage')->group(function () {
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

        // AI Model Management - requires ai.manage permission
        Route::prefix('models')->middleware('permission:ai.manage')->group(function () {
            Route::get('/', [AIModelController::class, 'index']);
            Route::post('/', [AIModelController::class, 'store']);
            Route::get('/{id}', [AIModelController::class, 'show']);
            Route::put('/{id}', [AIModelController::class, 'update']);
            Route::delete('/{id}', [AIModelController::class, 'destroy']);
            Route::post('/{id}/default', [AIModelController::class, 'setDefault']);
            Route::post('/{id}/test', [AIModelController::class, 'testModel']);
            Route::get('/provider/{providerId}', [AIModelController::class, 'getProviderModels']);
        });

        // AI Configuration Management - requires ai.configure permission
        Route::prefix('config')->middleware('permission:ai.configure')->group(function () {
            Route::get('/', [AIConfigController::class, 'index']);
            Route::put('/', [AIConfigController::class, 'update']);
            Route::get('/fallbacks', [AIConfigController::class, 'getFallbacks']);
            Route::put('/fallbacks', [AIConfigController::class, 'updateFallbacks']);
            Route::get('/cache', [AIConfigController::class, 'getCache']);
            Route::put('/cache', [AIConfigController::class, 'updateCache']);
            Route::get('/rate-limits', [AIConfigController::class, 'getRateLimits']);
            Route::put('/rate-limits', [AIConfigController::class, 'updateRateLimits']);
        });

        // AI Prompt Template Management - requires ai.manage permission
        Route::prefix('prompts')->middleware('permission:ai.manage')->group(function () {
            Route::get('/', [AIPromptTemplateController::class, 'index']);
            Route::post('/', [AIPromptTemplateController::class, 'store']);
            Route::get('/{id}', [AIPromptTemplateController::class, 'show']);
            Route::put('/{id}', [AIPromptTemplateController::class, 'update']);
            Route::delete('/{id}', [AIPromptTemplateController::class, 'destroy']);
            Route::post('/{id}/render', [AIPromptTemplateController::class, 'render']);
        });
    });

    // Widget routes
    Route::prefix('widgets')->middleware('permission:chat.manage')->group(function () {
        Route::get('/', [WidgetController::class, 'index']);
        Route::post('/', [WidgetController::class, 'store']);
        Route::get('/{id}', [WidgetController::class, 'show']);
        Route::put('/{id}', [WidgetController::class, 'update']);
        Route::delete('/{id}', [WidgetController::class, 'destroy']);
        Route::post('/{id}/publish', [WidgetController::class, 'publish']);
        Route::post('/{id}/unpublish', [WidgetController::class, 'unpublish']);
        Route::get('/{id}/embed-code', [WidgetController::class, 'getEmbedCode']);
    });
});

// Public widget routes
Route::get('/widget/{widgetId}', [WidgetPublicController::class, 'show']);
Route::get('/widget/{widgetId}/script.js', [WidgetPublicController::class, 'script']);
Route::post('/widget/{widgetId}/chat', [WidgetPublicController::class, 'chat']);
Route::post('/widget/{widgetId}/analytics', [WidgetPublicController::class, 'recordAnalytics']);
