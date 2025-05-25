<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // User management
            'view users',
            'create users',
            'edit users',
            'delete users',
            
            // Role management
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
            
            // Permission management
            'view permissions',
            'assign permissions',
            
            // AI Module permissions
            'view ai modules',
            'manage ai modules',
            'configure ai models',
            
            // Chat permissions
            'view chats',
            'manage chats',
            'delete chats',
            
            // Dashboard permissions
            'view dashboard',
            'view analytics',
            
            // Settings permissions
            'view settings',
            'manage settings',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        $managerRole = Role::create(['name' => 'manager']);
        $managerRole->givePermissionTo([
            'view users',
            'edit users',
            'view roles',
            'view ai modules',
            'manage ai modules',
            'view chats',
            'manage chats',
            'view dashboard',
            'view analytics',
            'view settings',
        ]);

        $userRole = Role::create(['name' => 'user']);
        $userRole->givePermissionTo([
            'view chats',
            'view dashboard',
        ]);
    }
}
