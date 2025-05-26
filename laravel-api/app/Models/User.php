<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the user's full name.
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Temporary role methods (replace with Spatie Laravel Permission later)
     */
    public function assignRole(string $role): void
    {
        // For now, just store in a simple way - this should be replaced with proper role system
        // This is a temporary implementation
    }

    public function getRoleNames(): array
    {
        // Return default role for now
        return ['user'];
    }

    public function getAllPermissions()
    {
        // Return basic permissions for now
        return collect([
            (object)['name' => 'view chats'],
            (object)['name' => 'view dashboard'],
        ]);
    }
}
