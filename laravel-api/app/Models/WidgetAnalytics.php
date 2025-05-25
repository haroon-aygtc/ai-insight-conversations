<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class WidgetAnalytics extends Model
{
    use HasFactory;

    protected $fillable = [
        'widget_id',
        'event_type',
        'ip_address',
        'user_agent',
        'referrer_url',
        'page_url',
        'event_data',
        'session_id',
        'visitor_id',
    ];

    protected $casts = [
        'event_data' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the widget that owns the analytics.
     */
    public function widget(): BelongsTo
    {
        return $this->belongsTo(Widget::class);
    }

    /**
     * Scope to filter by event type.
     */
    public function scopeByEventType($query, string $eventType)
    {
        return $query->where('event_type', $eventType);
    }

    /**
     * Scope to filter by date range.
     */
    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    /**
     * Scope to get today's analytics.
     */
    public function scopeToday($query)
    {
        return $query->whereDate('created_at', Carbon::today());
    }

    /**
     * Scope to get this week's analytics.
     */
    public function scopeThisWeek($query)
    {
        return $query->whereBetween('created_at', [
            Carbon::now()->startOfWeek(),
            Carbon::now()->endOfWeek()
        ]);
    }

    /**
     * Scope to get this month's analytics.
     */
    public function scopeThisMonth($query)
    {
        return $query->whereMonth('created_at', Carbon::now()->month)
                    ->whereYear('created_at', Carbon::now()->year);
    }

    /**
     * Get unique visitors count.
     */
    public static function getUniqueVisitors($widgetId, $startDate = null, $endDate = null)
    {
        $query = static::where('widget_id', $widgetId)
                      ->whereNotNull('visitor_id')
                      ->distinct('visitor_id');

        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        return $query->count();
    }

    /**
     * Get event counts by type.
     */
    public static function getEventCounts($widgetId, $startDate = null, $endDate = null)
    {
        $query = static::where('widget_id', $widgetId)
                      ->selectRaw('event_type, COUNT(*) as count')
                      ->groupBy('event_type');

        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        return $query->pluck('count', 'event_type')->toArray();
    }

    /**
     * Get analytics summary for a widget.
     */
    public static function getSummary($widgetId, $period = 'week')
    {
        $query = static::where('widget_id', $widgetId);

        switch ($period) {
            case 'today':
                $query->today();
                break;
            case 'week':
                $query->thisWeek();
                break;
            case 'month':
                $query->thisMonth();
                break;
        }

        $totalEvents = $query->count();
        $uniqueVisitors = static::getUniqueVisitors($widgetId);
        $eventCounts = static::getEventCounts($widgetId);

        return [
            'total_events' => $totalEvents,
            'unique_visitors' => $uniqueVisitors,
            'event_counts' => $eventCounts,
            'period' => $period,
        ];
    }

    /**
     * Log a widget event.
     */
    public static function logEvent(
        int $widgetId,
        string $eventType,
        array $eventData = [],
        string $ipAddress = null,
        string $userAgent = null,
        string $referrerUrl = null,
        string $pageUrl = null,
        string $sessionId = null,
        string $visitorId = null
    ): self {
        return static::create([
            'widget_id' => $widgetId,
            'event_type' => $eventType,
            'event_data' => $eventData,
            'ip_address' => $ipAddress ?? request()->ip(),
            'user_agent' => $userAgent ?? request()->userAgent(),
            'referrer_url' => $referrerUrl,
            'page_url' => $pageUrl,
            'session_id' => $sessionId,
            'visitor_id' => $visitorId,
        ]);
    }
}
