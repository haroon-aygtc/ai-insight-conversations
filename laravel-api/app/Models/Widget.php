<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Widget extends Model
{
    use HasFactory;

    protected $fillable = [
        'widget_id',
        'user_id',
        'name',
        'description',
        'appearance_config',
        'behavior_config',
        'content_config',
        'embedding_config',
        'is_active',
        'is_published',
        'status',
        'published_at',
        'views_count',
        'interactions_count',
    ];

    protected $casts = [
        'appearance_config' => 'array',
        'behavior_config' => 'array',
        'content_config' => 'array',
        'embedding_config' => 'array',
        'is_active' => 'boolean',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'views_count' => 'integer',
        'interactions_count' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($widget) {
            if (empty($widget->widget_id)) {
                $widget->widget_id = 'widget_' . Str::random(12);
            }
        });
    }

    /**
     * Get the user that owns the widget.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the analytics for the widget.
     */
    public function analytics(): HasMany
    {
        return $this->hasMany(WidgetAnalytics::class);
    }

    /**
     * Scope to get active widgets.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get published widgets.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Scope to get widgets by status.
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Get the full configuration for the widget.
     */
    public function getFullConfigAttribute(): array
    {
        return [
            'appearance' => $this->appearance_config ?? [],
            'behavior' => $this->behavior_config ?? [],
            'content' => $this->content_config ?? [],
            'embedding' => $this->embedding_config ?? [],
        ];
    }

    /**
     * Get the embed URL for the widget.
     */
    public function getEmbedUrlAttribute(): string
    {
        return config('app.url') . "/widget/{$this->widget_id}";
    }

    /**
     * Get the script URL for the widget.
     */
    public function getScriptUrlAttribute(): string
    {
        return config('app.url') . "/widget/{$this->widget_id}/script.js";
    }

    /**
     * Increment views count.
     */
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    /**
     * Increment interactions count.
     */
    public function incrementInteractions(): void
    {
        $this->increment('interactions_count');
    }

    /**
     * Publish the widget.
     */
    public function publish(): void
    {
        $this->update([
            'is_published' => true,
            'status' => 'published',
            'published_at' => now(),
        ]);
    }

    /**
     * Unpublish the widget.
     */
    public function unpublish(): void
    {
        $this->update([
            'is_published' => false,
            'status' => 'draft',
            'published_at' => null,
        ]);
    }

    /**
     * Archive the widget.
     */
    public function archive(): void
    {
        $this->update([
            'is_active' => false,
            'is_published' => false,
            'status' => 'archived',
        ]);
    }

    /**
     * Get default widget configuration.
     */
    public static function getDefaultConfig(): array
    {
        return [
            'appearance' => [
                'primaryColor' => '#6366f1',
                'secondaryColor' => '#ffffff',
                'borderRadius' => 8,
                'chatIconSize' => 40,
                'fontFamily' => 'inter',
            ],
            'behavior' => [
                'autoOpen' => 'no',
                'delay' => 5,
                'position' => 'bottom-right',
                'animation' => 'fade',
                'mobileBehavior' => 'responsive',
                'showAfterPageViews' => 1,
            ],
            'content' => [
                'welcomeMessage' => 'Hello! How can I help you today?',
                'botName' => 'AI Assistant',
                'inputPlaceholder' => 'Type a message...',
                'chatButtonText' => 'Chat with us',
                'headerTitle' => 'Chat Support',
                'enablePreChatForm' => false,
                'preChatFormFields' => [],
                'preChatFormRequired' => false,
                'enableFeedback' => false,
                'feedbackPosition' => 'after-bot',
            ],
            'embedding' => [
                'allowedDomains' => '*',
                'enableAnalytics' => true,
                'enableCORS' => true,
            ],
        ];
    }
}
