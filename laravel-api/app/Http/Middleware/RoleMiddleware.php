<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use App\Constants\Roles;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|string[]  $role
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $role): Response
    {
        if (!auth()->check()) {
            Log::warning('Unauthenticated access attempt', [
                'path' => $request->path(),
                'ip' => $request->ip(),
                'required_role' => $role
            ]);

            return response()->json([
                'message' => 'Unauthenticated.',
                'status' => 'error'
            ], 401);
        }

        $roles = is_array($role) ? $role : explode('|', $role);
        $user = auth()->user();

        if (!$user->hasAnyRole($roles)) {
            Log::warning('Unauthorized access attempt', [
                'user_id' => $user->id,
                'path' => $request->path(),
                'ip' => $request->ip(),
                'required_roles' => $roles,
                'user_roles' => $user->getRoleNames()
            ]);

            return response()->json([
                'message' => 'Unauthorized. Required role not found.',
                'status' => 'error',
                'required_roles' => config('app.debug') ? $roles : null
            ], 403);
        }

        return $next($request);
    }
}
