<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
});
