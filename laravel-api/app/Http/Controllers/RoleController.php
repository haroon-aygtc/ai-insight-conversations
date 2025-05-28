<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Display a listing of roles with pagination and filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search', '');
        
        $query = Role::with('permissions');
        
        // Apply search filter
        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }
        
        $roles = $query->paginate($perPage);
        
        // Transform the data to include user count
        $rolesData = $roles->items();
        foreach ($rolesData as $role) {
            $role->user_count = $role->users()->count();
            $role->permissions_list = $role->permissions->pluck('name');
        }
        
        return response()->json([
            'roles' => $rolesData,
            'total' => $roles->total(),
            'page' => $roles->currentPage(),
            'perPage' => $roles->perPage(),
        ]);
    }
    
    /**
     * Store a newly created role in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'description' => 'nullable|string|max:1000',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name',
        ]);
        
        $role = Role::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);
        
        if (!empty($validated['permissions'])) {
            $role->givePermissionTo($validated['permissions']);
        }
        
        // Log activity
        activity()
            ->causedBy(auth()->user())
            ->performedOn($role)
            ->withProperties(['permissions' => $role->permissions->pluck('name')])
            ->log('created role');
        
        return response()->json([
            'message' => 'Role created successfully',
            'role' => $role->load('permissions'),
        ], 201);
    }
    
    /**
     * Display the specified role.
     */
    public function show($id): JsonResponse
    {
        $role = Role::with('permissions')->findOrFail($id);
        $role->user_count = $role->users()->count();
        
        return response()->json([
            'role' => $role,
            'permissions' => $role->permissions->pluck('name'),
        ]);
    }
    
    /**
     * Update the specified role in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $role = Role::findOrFail($id);
        
        // Prevent updating super_admin role for security
        if ($role->name === 'super_admin' && !auth()->user()->hasRole('super_admin')) {
            return response()->json([
                'message' => 'You do not have permission to modify the super_admin role',
            ], 403);
        }
        
        $validated = $request->validate([
            'name' => [
                'sometimes', 'required', 'string', 'max:255',
                \Illuminate\Validation\Rule::unique('roles')->ignore($role->id),
            ],
            'description' => 'nullable|string|max:1000',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name',
        ]);
        
        // Update role data
        if (isset($validated['name'])) {
            $role->name = $validated['name'];
        }
        
        if (isset($validated['description'])) {
            $role->description = $validated['description'];
        }
        
        $role->save();
        
        // Update permissions if provided
        if (isset($validated['permissions'])) {
            $oldPermissions = $role->permissions->pluck('name');
            $role->syncPermissions($validated['permissions']);
            
            // Log activity
            activity()
                ->causedBy(auth()->user())
                ->performedOn($role)
                ->withProperties([
                    'old_permissions' => $oldPermissions,
                    'new_permissions' => $role->permissions->pluck('name')
                ])
                ->log('updated role permissions');
        }
        
        return response()->json([
            'message' => 'Role updated successfully',
            'role' => $role->load('permissions'),
        ]);
    }
    
    /**
     * Remove the specified role from storage.
     */
    public function destroy($id): JsonResponse
    {
        $role = Role::findOrFail($id);
        
        // Prevent deleting default roles
        if (in_array($role->name, ['super_admin', 'admin', 'user'])) {
            return response()->json([
                'message' => 'Default roles cannot be deleted',
            ], 403);
        }
        
        // Check if role has users
        if ($role->users()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete role with assigned users',
            ], 422);
        }
        
        // Log activity before deletion
        activity()
            ->causedBy(auth()->user())
            ->performedOn($role)
            ->withProperties(['permissions' => $role->permissions->pluck('name')])
            ->log('deleted role');
        
        $role->delete();
        
        return response()->json([
            'message' => 'Role deleted successfully',
        ]);
    }
    
    /**
     * Get all available permissions.
     */
    public function getPermissions(): JsonResponse
    {
        $permissions = Permission::all();
        
        // Group permissions by category
        $groupedPermissions = [];
        foreach ($permissions as $permission) {
            $parts = explode('.', $permission->name);
            $category = $parts[0] ?? 'other';
            
            if (!isset($groupedPermissions[$category])) {
                $groupedPermissions[$category] = [];
            }
            
            $groupedPermissions[$category][] = $permission;
        }
        
        return response()->json([
            'permissions' => $permissions,
            'groupedPermissions' => $groupedPermissions,
        ]);
    }
}
