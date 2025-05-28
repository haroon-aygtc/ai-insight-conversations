<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:create {--email=} {--password=} {--first_name=} {--last_name=} {--role=super_admin}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new admin user with specified role';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        // Get or prompt for user details
        $email = $this->option('email') ?: $this->ask('Enter email address');
        $firstName = $this->option('first_name') ?: $this->ask('Enter first name');
        $lastName = $this->option('last_name') ?: $this->ask('Enter last name');
        $password = $this->option('password') ?: $this->secret('Enter password (min 8 characters)');
        $role = $this->option('role');

        // Validate input
        $validator = Validator::make([
            'email' => $email,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'password' => $password,
        ], [
            'email' => ['required', 'email', 'unique:users,email'],
            'first_name' => ['required', 'string', 'min:2'],
            'last_name' => ['required', 'string', 'min:2'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }
            return 1;
        }

        // Check if role exists
        if (!Role::where('name', $role)->exists()) {
            $this->error("Role '{$role}' does not exist. Available roles:");
            $roles = Role::all()->pluck('name')->toArray();
            $this->info(implode(', ', $roles));
            return 1;
        }

        // Create user
        $user = User::create([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $email,
            'password' => Hash::make($password),
            'email_verified_at' => now(),
        ]);

        // Assign role using Spatie's assignRole method
        $user->assignRole($role);

        $this->info("Admin user created successfully:");
        $this->info("Name: {$firstName} {$lastName}");
        $this->info("Email: {$email}");
        $this->info("Role: {$role}");

        return 0;
    }
}
