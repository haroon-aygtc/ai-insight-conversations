<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Constants\Roles;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define all permissions dynamically
        $permissions = [
            // User management
            'user.view',
            'user.create',
            'user.edit',
            'user.delete',

            // Role management
            'role.view',
            'role.create',
            'role.edit',
            'role.delete',

            // Permission management
            'permission.view',
            'permission.create',
            'permission.edit',
            'permission.delete',
            'permission.assign',

            // Dashboard
            'dashboard.view',
            'analytics.view',

            // Chat
            'chat.view',
            'chat.manage',
            'chat.delete',

            // AI Module
            'ai.view',
            'ai.manage',
            'ai.configure',

            // Settings
            'settings.view',
            'settings.manage',

            // System
            'system.settings',
            'system.logs',
        ];

        // Create permissions
        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        $this->command->info('Permissions created successfully');

        // Create roles with appropriate permissions

        // Super Admin - has all permissions
        $superAdminRole = Role::findOrCreate(Roles::SUPER_ADMIN, 'web');
        $superAdminRole->syncPermissions(Permission::all());
        $this->command->info('Super Admin role created with all permissions');

        // Admin - has most permissions except critical ones
        $adminRole = Role::findOrCreate(Roles::ADMIN, 'web');
        $adminRole->syncPermissions([
            'user.view', 'user.create', 'user.edit',
            'role.view', 'role.create', 'role.edit',
            'permission.view', 'permission.create', 'permission.edit',
            'ai.view', 'ai.manage',
            'chat.view', 'chat.manage', 'chat.delete',
            'dashboard.view', 'analytics.view',
            'settings.view',
            'system.logs',
        ]);
        $this->command->info('Admin role created with appropriate permissions');

        // Manager - has limited administrative permissions
        $managerRole = Role::findOrCreate(Roles::MANAGER, 'web');
        $managerRole->syncPermissions([
            'user.view',
            'ai.view', 'ai.manage',
            'chat.view', 'chat.manage',
            'dashboard.view', 'analytics.view',
            'settings.view',
        ]);
        $this->command->info('Manager role created with appropriate permissions');

        // User - has basic permissions
        $userRole = Role::findOrCreate(Roles::USER, 'web');
        $userRole->syncPermissions([
            'chat.view',
            'dashboard.view',
        ]);
        $this->command->info('User role created with basic permissions');
    }
}
