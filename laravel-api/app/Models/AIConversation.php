<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AIConversation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'user_id',
        'guest_id',
        'ai_provider_id',
        'ai_model_id',
        'system_prompt',
        'context',
        'metadata',
        'is_archived',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'context' => 'array',
        'metadata' => 'array',
        'is_archived' => 'boolean',
    ];

    /**
     * Get the user that owns the conversation.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the AI provider for this conversation.
     */
    public function provider(): BelongsTo
    {
        return $this->belongsTo(AIProvider::class, 'ai_provider_id');
    }

    /**
     * Get the AI model for this conversation.
     */
    public function model(): BelongsTo
    {
        return $this->belongsTo(AIModel::class, 'ai_model_id');
    }

    /**
     * Get the messages for this conversation.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(AIMessage::class);
    }
}
