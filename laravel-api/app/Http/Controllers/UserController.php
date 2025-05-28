<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of users with pagination and filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search', '');
        $role = $request->input('role', '');
        
        $query = User::with('roles');
        
        // Apply search filter
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        // Apply role filter
        if ($role) {
            $query->whereHas('roles', function($q) use ($role) {
                $q->where('name', $role);
            });
        }
        
        $users = $query->paginate($perPage);
        
        return response()->json([
            'users' => $users->items(),
            'total' => $users->total(),
            'page' => $users->currentPage(),
            'perPage' => $users->perPage(),
        ]);
    }
    
    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8|confirmed',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,name',
        ]);
        
        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
        ]);
        
        if (!empty($validated['roles'])) {
            $user->assignRole($validated['roles']);
        } else {
            $user->assignRole('user'); // Default role
        }
        
        // Log activity
        activity()
            ->causedBy(auth()->user())
            ->performedOn($user)
            ->withProperties(['roles' => $user->getRoleNames()])
            ->log('created user');
        
        return response()->json([
            'message' => 'User created successfully',
            'user' => $user->load('roles'),
        ], 201);
    }
    
    /**
     * Display the specified user.
     */
    public function show($id): JsonResponse
    {
        $user = User::with('roles', 'permissions')->findOrFail($id);
        
        return response()->json([
            'user' => $user,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ]);
    }
    
    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $user = User::findOrFail($id);
        
        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes', 'required', 'string', 'email', 'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8|confirmed',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,name',
        ]);
        
        // Update user data
        if (isset($validated['first_name'])) {
            $user->first_name = $validated['first_name'];
        }
        
        if (isset($validated['last_name'])) {
            $user->last_name = $validated['last_name'];
        }
        
        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }
        
        if (isset($validated['phone'])) {
            $user->phone = $validated['phone'];
        }
        
        if (isset($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        
        $user->save();
        
        // Update roles if provided
        if (isset($validated['roles'])) {
            $oldRoles = $user->getRoleNames();
            $user->syncRoles($validated['roles']);
            
            // Log activity
            activity()
                ->causedBy(auth()->user())
                ->performedOn($user)
                ->withProperties([
                    'old_roles' => $oldRoles,
                    'new_roles' => $user->getRoleNames()
                ])
                ->log('updated user roles');
        }
        
        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user->load('roles'),
        ]);
    }
    
    /**
     * Remove the specified user from storage.
     */
    public function destroy($id): JsonResponse
    {
        $user = User::findOrFail($id);
        
        // Prevent deleting yourself
        if (auth()->id() === $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own account',
            ], 403);
        }
        
        // Log activity before deletion
        activity()
            ->causedBy(auth()->user())
            ->performedOn($user)
            ->withProperties(['roles' => $user->getRoleNames()])
            ->log('deleted user');
        
        $user->delete();
        
        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }
    
    /**
     * Get all available roles.
     */
    public function getRoles(): JsonResponse
    {
        $roles = Role::all();
        
        return response()->json([
            'roles' => $roles,
        ]);
    }
}
