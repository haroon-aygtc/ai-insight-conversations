<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Permission;
use Illuminate\Validation\Rule;

class PermissionController extends Controller
{
    /**
     * Display a listing of permissions with pagination and filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 20);
        $search = $request->input('search', '');

        $query = Permission::query();

        // Apply search filter
        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $permissions = $query->paginate($perPage);

        // Group permissions by category
        $groupedPermissions = [];
        foreach ($permissions->items() as $permission) {
            $parts = explode('.', $permission->name);
            $category = $parts[0] ?? 'other';

            if (!isset($groupedPermissions[$category])) {
                $groupedPermissions[$category] = [];
            }

            $groupedPermissions[$category][] = $permission;
        }

        return response()->json([
            'permissions' => $permissions->items(),
            'groupedPermissions' => $groupedPermissions,
            'total' => $permissions->total(),
            'page' => $permissions->currentPage(),
            'perPage' => $permissions->perPage(),
        ]);
    }

    /**
     * Display the specified permission.
     */
    public function show($id): JsonResponse
    {
        $permission = Permission::findOrFail($id);

        // Get roles that have this permission
        $roles = $permission->roles()->get();

        return response()->json([
            'permission' => $permission,
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created permission in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
            'guard_name' => 'required|string|in:web,api',
        ]);

        $permission = Permission::create([
            'name' => $validated['name'],
            'guard_name' => $validated['guard_name'],
        ]);

        // Log activity
        activity()
            ->causedBy(auth()->user())
            ->performedOn($permission)
            ->log('created permission');

        return response()->json([
            'message' => 'Permission created successfully',
            'permission' => $permission,
        ], 201);
    }

    /**
     * Update the specified permission in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $permission = Permission::findOrFail($id);

        $validated = $request->validate([
            'name' => [
                'sometimes', 'required', 'string', 'max:255',
                Rule::unique('permissions')->ignore($permission->id),
            ],
            'guard_name' => 'sometimes|required|string|in:web,api',
        ]);

        // Update permission data
        if (isset($validated['name'])) {
            $permission->name = $validated['name'];
        }

        if (isset($validated['guard_name'])) {
            $permission->guard_name = $validated['guard_name'];
        }

        $permission->save();

        // Log activity
        activity()
            ->causedBy(auth()->user())
            ->performedOn($permission)
            ->log('updated permission');

        return response()->json([
            'message' => 'Permission updated successfully',
            'permission' => $permission,
        ]);
    }

    /**
     * Remove the specified permission from storage.
     */
    public function destroy($id): JsonResponse
    {
        $permission = Permission::findOrFail($id);

        // Check if permission is assigned to any roles
        if ($permission->roles()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete permission that is assigned to roles',
            ], 422);
        }

        // Log activity before deletion
        activity()
            ->causedBy(auth()->user())
            ->performedOn($permission)
            ->log('deleted permission');

        $permission->delete();

        return response()->json([
            'message' => 'Permission deleted successfully',
        ]);
    }

    /**
     * Check if the authenticated user has a specific permission.
     */
    public function checkPermission(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'permission' => 'required|string|exists:permissions,name',
        ]);

        $hasPermission = auth()->user()->hasPermissionTo($validated['permission']);

        return response()->json([
            'permission' => $validated['permission'],
            'hasPermission' => $hasPermission,
        ]);
    }

    /**
     * Check if the authenticated user has multiple permissions.
     */
    public function checkPermissions(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'string|exists:permissions,name',
            'requireAll' => 'boolean',
        ]);

        $requireAll = $validated['requireAll'] ?? false;

        $result = [];
        $hasAllPermissions = true;
        $hasAnyPermission = false;

        foreach ($validated['permissions'] as $permission) {
            $has = auth()->user()->hasPermissionTo($permission);
            $result[$permission] = $has;

            if (!$has) {
                $hasAllPermissions = false;
            }

            if ($has) {
                $hasAnyPermission = true;
            }
        }

        return response()->json([
            'permissions' => $result,
            'hasAllPermissions' => $hasAllPermissions,
            'hasAnyPermission' => $hasAnyPermission,
            'result' => $requireAll ? $hasAllPermissions : $hasAnyPermission,
        ]);
    }
}
