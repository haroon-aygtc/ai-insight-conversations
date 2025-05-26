<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Models\ActivityLog;
use App\Models\UserSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
        ]);

        // Assign default role
        $user->assignRole('user');

        // Log the user in (create session)
        Auth::login($user);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
        ], 201);
    }

    /**
     * Login user.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');
        $rememberMe = $request->boolean('remember_me', false);

        if (!Auth::attempt($credentials, $rememberMe)) {
            // Log failed login attempt
            $this->recordActivity(null, 'login_failed', 'Failed login attempt', $request);

            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = Auth::user();

        // Set session lifetime based on remember me
        $sessionLifetime = $rememberMe ? 43200 : 120; // 30 days or 2 hours
        config(['session.lifetime' => $sessionLifetime]);

        // Calculate session expiry
        $expiresAt = now()->addMinutes($sessionLifetime);

        // Store session information
        $this->storeSessionInfo($user, $request, $expiresAt, $rememberMe);

        // Log successful login
        $this->recordActivity($user->id, 'login', 'User logged in successfully', $request);

        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
                'session_id' => session()->getId(),
                'last_activity' => now()->toISOString(),
            ],
            'expires_at' => $expiresAt->toISOString(),
            'session_lifetime' => $sessionLifetime,
        ]);
    }

    /**
     * Get authenticated user.
     */
    public function user(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
        ]);
    }

    /**
     * Logout user.
     */
    public function logout(Request $request): JsonResponse
    {
        $user = Auth::user();

        // Log logout activity
        if ($user) {
            $this->recordActivity($user->id, 'logout', 'User logged out', $request);
        }

        // Remove session from user_sessions table
        UserSession::where('id', session()->getId())->delete();

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout successful',
        ]);
    }

    /**
     * Logout from all devices.
     */
    public function logoutAllDevices(Request $request): JsonResponse
    {
        $user = Auth::user();

        // Log activity
        $this->recordActivity($user->id, 'logout_all_devices', 'User logged out from all devices', $request);

        // Delete all user sessions
        UserSession::where('user_id', $user->id)->delete();

        // Logout current session
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out from all devices successfully',
        ]);
    }

    /**
     * Extend session.
     */
    public function extendSession(Request $request): JsonResponse
    {
        $request->validate([
            'extend_minutes' => 'required|integer|min:1|max:1440', // Max 24 hours
        ]);

        $user = Auth::user();
        $extendMinutes = $request->integer('extend_minutes', 30);
        $newExpiresAt = now()->addMinutes($extendMinutes);

        // Update session expiry
        UserSession::where('id', session()->getId())
            ->update(['expires_at' => $newExpiresAt]);

        // Log activity
        $this->recordActivity($user->id, 'session_extended', "Session extended by {$extendMinutes} minutes", $request);

        return response()->json([
            'message' => 'Session extended successfully',
            'expires_at' => $newExpiresAt->toISOString(),
        ]);
    }

    /**
     * Update user activity.
     */
    public function updateActivity(Request $request): JsonResponse
    {
        $user = Auth::user();

        // Update last activity in session
        UserSession::where('id', session()->getId())
            ->update(['last_activity' => now()->timestamp]);

        return response()->json([
            'message' => 'Activity updated',
            'last_activity' => now()->toISOString(),
        ]);
    }

    /**
     * Get active sessions.
     */
    public function getActiveSessions(Request $request): JsonResponse
    {
        $user = Auth::user();
        $currentSessionId = session()->getId();

        $sessions = UserSession::where('user_id', $user->id)
            ->active()
            ->orderBy('last_activity', 'desc')
            ->get()
            ->map(function ($session) use ($currentSessionId) {
                return [
                    'id' => $session->id,
                    'ip_address' => $session->ip_address,
                    'user_agent' => $session->user_agent,
                    'last_activity' => Carbon::createFromTimestamp($session->last_activity)->toISOString(),
                    'is_current' => $session->id === $currentSessionId,
                    'location' => $session->location,
                ];
            });

        return response()->json([
            'sessions' => $sessions,
        ]);
    }

    /**
     * Terminate specific session.
     */
    public function terminateSession(Request $request, string $sessionId): JsonResponse
    {
        $user = Auth::user();

        $session = UserSession::where('id', $sessionId)
            ->where('user_id', $user->id)
            ->first();

        if (!$session) {
            return response()->json([
                'message' => 'Session not found',
            ], 404);
        }

        if ($session->id === session()->getId()) {
            return response()->json([
                'message' => 'Cannot terminate current session',
            ], 400);
        }

        $session->delete();

        // Log activity
        $this->recordActivity($user->id, 'session_terminated', "Terminated session: {$sessionId}", $request);

        return response()->json([
            'message' => 'Session terminated successfully',
        ]);
    }

    /**
     * Log activity.
     */
    public function logActivity(Request $request): JsonResponse
    {
        $request->validate([
            'action' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
        ]);

        $user = Auth::user();

        $this->recordActivity(
            $user->id,
            $request->string('action'),
            $request->string('description'),
            $request
        );

        return response()->json([
            'message' => 'Activity logged successfully',
        ]);
    }
    
    /**
     * Refresh the user's session without redirecting
     * This is used to silently refresh authentication during widget operations
     */
    public function refreshSession(Request $request): JsonResponse
    {
        // Get the current user
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated',
            ], 401);
        }
        
        // Regenerate the session ID to prevent session fixation
        Session::regenerate();
        
        // Update the session expiration time
        $expiresAt = now()->addMinutes(config('session.lifetime', 240));
        
        // Update the user session record
        UserSession::where('id', session()->getId())
            ->update([
                'last_activity' => now()->timestamp,
                'expires_at' => $expiresAt,
            ]);
        
        // Log this activity
        $this->recordActivity(
            $user->id,
            'session_refreshed',
            'Session refreshed during widget operation',
            $request
        );
        
        return response()->json([
            'message' => 'Session refreshed successfully',
            'expires_at' => $expiresAt->toISOString(),
        ]);
    }

    /**
     * Get activity logs.
     */
    public function getActivityLogs(Request $request): JsonResponse
    {
        $request->validate([
            'page' => 'integer|min:1',
            'limit' => 'integer|min:1|max:100',
            'action' => 'string',
            'start_date' => 'date',
            'end_date' => 'date|after_or_equal:start_date',
        ]);

        $user = Auth::user();
        $page = $request->integer('page', 1);
        $limit = $request->integer('limit', 50);

        $query = ActivityLog::where('user_id', $user->id)
            ->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->has('action')) {
            $query->where('action', $request->string('action'));
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [
                $request->date('start_date'),
                $request->date('end_date'),
            ]);
        }

        $total = $query->count();
        $logs = $query->skip(($page - 1) * $limit)
            ->take($limit)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'description' => $log->description,
                    'ip_address' => $log->ip_address,
                    'user_agent' => $log->user_agent,
                    'created_at' => $log->created_at->toISOString(),
                ];
            });

        return response()->json([
            'logs' => $logs,
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'total_pages' => ceil($total / $limit),
        ]);
    }

    /**
     * Helper method to log activity.
     */
    private function recordActivity(?int $userId, string $action, string $description, Request $request): void
    {
        ActivityLog::create([
            'user_id' => $userId,
            'action' => $action,
            'description' => $description,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent() ?? 'Unknown',
            'metadata' => [
                'timestamp' => now()->toISOString(),
                'session_id' => session()->getId(),
            ],
        ]);
    }

    /**
     * Helper method to store session information.
     */
    private function storeSessionInfo(User $user, Request $request, Carbon $expiresAt, bool $rememberToken): void
    {
        UserSession::updateOrCreate(
            ['id' => session()->getId()],
            [
                'user_id' => $user->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent() ?? 'Unknown',
                'payload' => base64_encode(serialize(session()->all())),
                'last_activity' => now()->timestamp,
                'expires_at' => $expiresAt,
                'remember_token' => $rememberToken,
            ]
        );
    }
}
