<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AIModel extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'ai_provider_id',
        'name',
        'enabled',
        'max_tokens',
        'temperature',
        'is_default',
        'capabilities',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'enabled' => 'boolean',
        'is_default' => 'boolean',
        'max_tokens' => 'integer',
        'temperature' => 'float',
        'capabilities' => 'array',
    ];

    /**
     * Get the provider that owns the model.
     */
    public function provider(): BelongsTo
    {
        return $this->belongsTo(AIProvider::class, 'ai_provider_id');
    }
}
