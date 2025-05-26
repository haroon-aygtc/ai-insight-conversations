<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'description',
        'fields',
        'is_default',
    ];

    protected $casts = [
        'fields' => 'array',
        'is_default' => 'boolean',
    ];

    /**
     * Scope to get templates by type.
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to get default templates.
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }
}
