<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class PermissionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|string[]  $permission
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $permission): Response
    {
        if (!auth()->check()) {
            Log::warning('Unauthenticated access attempt', [
                'path' => $request->path(),
                'ip' => $request->ip(),
                'required_permission' => $permission
            ]);

            return response()->json([
                'message' => 'Unauthenticated.',
                'status' => 'error'
            ], 401);
        }

        $permissions = is_array($permission) ? $permission : explode('|', $permission);
        $user = auth()->user();

        if (!$user->hasAnyPermission($permissions)) {
            Log::warning('Unauthorized access attempt', [
                'user_id' => $user->id,
                'path' => $request->path(),
                'ip' => $request->ip(),
                'required_permissions' => $permissions,
                'user_permissions' => $user->getAllPermissions()->pluck('name')
            ]);

            return response()->json([
                'message' => 'Unauthorized. Required permission not found.',
                'status' => 'error',
                'required_permissions' => config('app.debug') ? $permissions : null
            ], 403);
        }

        return $next($request);
    }
}
