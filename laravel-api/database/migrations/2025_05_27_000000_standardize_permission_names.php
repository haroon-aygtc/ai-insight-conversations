<?php

declare(strict_types=1);

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations to standardize permission names to dot notation
     */
    public function up(): void
    {
        // Map old-style space-separated permissions to new dot notation format
        $permissionMap = [
            'view users' => 'user.view',
            'create users' => 'user.create',
            'edit users' => 'user.edit',
            'delete users' => 'user.delete',

            'view roles' => 'role.view',
            'create roles' => 'role.create',
            'edit roles' => 'role.edit',
            'delete roles' => 'role.delete',

            'view permissions' => 'permission.view',
            'assign permissions' => 'permission.assign',

            'view ai modules' => 'ai.view',
            'manage ai modules' => 'ai.manage',
            'configure ai models' => 'ai.configure',

            'view chats' => 'chat.view',
            'manage chats' => 'chat.manage',
            'delete chats' => 'chat.delete',

            'view dashboard' => 'dashboard.view',
            'view analytics' => 'analytics.view',

            'view settings' => 'settings.view',
            'manage settings' => 'settings.manage',
        ];

        // Clear permission cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        foreach ($permissionMap as $oldName => $newName) {
            $oldPermission = Permission::where('name', $oldName)->first();

            if ($oldPermission) {
                // Find if new permission already exists
                $newPermission = Permission::where('name', $newName)->first();

                if ($newPermission) {
                    // Transfer role associations from old to new permission
                    foreach ($oldPermission->roles as $role) {
                        if (!$role->hasPermissionTo($newName)) {
                            $role->givePermissionTo($newName);
                        }
                    }

                    // Transfer direct model associations
                    $oldModelPerms = DB::table('model_has_permissions')
                        ->where('permission_id', $oldPermission->id)
                        ->get();

                    foreach ($oldModelPerms as $modelPerm) {
                        DB::table('model_has_permissions')->updateOrInsert(
                            [
                                'permission_id' => $newPermission->id,
                                'model_type' => $modelPerm->model_type,
                                'model_id' => $modelPerm->model_id,
                            ],
                            []
                        );
                    }

                    // Delete old permission
                    $oldPermission->delete();
                } else {
                    // Just rename the old permission
                    $oldPermission->name = $newName;
                    $oldPermission->save();
                }
            }
        }

        // Create any missing permissions
        $allPermissions = [
            'user.view', 'user.create', 'user.edit', 'user.delete',
            'role.view', 'role.create', 'role.edit', 'role.delete',
            'permission.view', 'permission.create', 'permission.edit', 'permission.delete', 'permission.assign',
            'dashboard.view', 'analytics.view',
            'chat.view', 'chat.manage', 'chat.delete',
            'ai.view', 'ai.manage', 'ai.configure',
            'settings.view', 'settings.manage',
            'system.settings', 'system.logs',
        ];

        foreach ($allPermissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }
    }

    /**
     * Reverse the migrations - not applicable for this migration
     */
    public function down(): void
    {
        // This migration cannot be reversed as it would be ambiguous
        // how to split permission names back into different formats
    }
};
