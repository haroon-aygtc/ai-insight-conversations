<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use App\Constants\Roles;

class AdminUserSeeder extends Seeder
{
    /**
     * Create a default admin user with appropriate roles.
     */
    public function run(): void
    {
        // Check if admin user already exists to avoid duplicates
        $adminEmail = 'admin@example.com';

        if (User::where('email', $adminEmail)->exists()) {
            $this->command->info('Admin user already exists. Skipping creation.');
            return;
        }

        // Create admin user
        $admin = User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => $adminEmail,
            'password' => Hash::make('password'), // Default password, should be changed after first login
            'email_verified_at' => now(),
        ]);

        // Check if roles exist
        $superAdminExists = Role::where('name', Roles::SUPER_ADMIN)->exists();
        $adminExists = Role::where('name', Roles::ADMIN)->exists();

        if ($superAdminExists) {
            // Use Spatie Permission's assignRole method
            $admin->assignRole(Roles::SUPER_ADMIN);
            $this->command->info('Created admin user with super_admin role.');
        } else if ($adminExists) {
            // Fallback to admin role if super_admin doesn't exist
            $admin->assignRole(Roles::ADMIN);
            $this->command->info('Created admin user with admin role.');
        } else {
            $this->command->error('No admin roles found. Please run RolesAndPermissionsSeeder first.');
        }

        $this->command->info('Admin user created successfully:');
        $this->command->info('Email: ' . $adminEmail);
        $this->command->info('Password: password');
        $this->command->warn('Please change the default password after first login!');
    }
}
