<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AIProvider extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'key',
        'type',
        'enabled',
        'is_default',
        'configuration',
        'icon_color',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'enabled' => 'boolean',
        'is_default' => 'boolean',
        'configuration' => 'array',
    ];

    /**
     * Get the models for the AI provider.
     */
    public function models(): HasMany
    {
        return $this->hasMany(AIModel::class);
    }

    /**
     * Get the provider's masked API key.
     */
    public function getMaskedApiKeyAttribute(): string
    {
        $apiKey = $this->configuration['api_key'] ?? '';
        
        if (empty($apiKey)) {
            return '';
        }

        $length = strlen($apiKey);

        if ($length <= 8) {
            return str_repeat('*', $length);
        }

        return substr($apiKey, 0, 4) . str_repeat('*', $length - 8) . substr($apiKey, -4);
    }
}
