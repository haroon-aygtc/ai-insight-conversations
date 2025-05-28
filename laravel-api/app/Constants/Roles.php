<?php

declare(strict_types=1);

namespace App\Constants;

/**
 * Role constants with standardized snake_case names
 */
final class Roles
{
    public const SUPER_ADMIN = 'super_admin';
    public const ADMIN = 'admin';
    public const MANAGER = 'manager';
    public const USER = 'user';

    /**
     * Get all defined roles
     */
    public static function all(): array
    {
        return [
            self::SUPER_ADMIN,
            self::ADMIN,
            self::MANAGER,
            self::USER,
        ];
    }

    /**
     * Get default role for new users
     */
    public static function getDefaultRole(): string
    {
        return self::USER;
    }

    /**
     * Get system roles that cannot be deleted
     */
    public static function getProtectedRoles(): array
    {
        return [
            self::SUPER_ADMIN,
            self::ADMIN,
            self::USER,
        ];
    }

    /**
     * Get role display names
     */
    public static function getDisplayNames(): array
    {
        return [
            self::SUPER_ADMIN => 'Super Administrator',
            self::ADMIN => 'Administrator',
            self::MANAGER => 'Manager',
            self::USER => 'User',
        ];
    }
}
