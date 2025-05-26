<?php

namespace App\Http\Controllers;

use App\Models\Widget;
use App\Models\WidgetAnalytics;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class WidgetPublicController extends Controller
{
    /**
     * Show widget public information.
     */
    public function show(string $widgetId): JsonResponse
    {
        $widget = Widget::where('widget_id', $widgetId)
            ->where('is_active', true)
            ->where('is_published', true)
            ->firstOrFail();

        // Increment views count
        $widget->incrementViews();

        return response()->json([
            'status' => 'success',
            'data' => [
                'widget_id' => $widget->widget_id,
                'appearance' => $widget->appearance_config,
                'behavior' => $widget->behavior_config,
                'content' => $widget->content_config,
                'embedding' => $widget->embedding_config,
            ]
        ]);
    }

    /**
     * Return widget script.
     */
    public function script(string $widgetId): Response
    {
        $widget = Widget::where('widget_id', $widgetId)
            ->where('is_active', true)
            ->where('is_published', true)
            ->firstOrFail();

        // Load widget script template from storage/app/widget-script.js and replace placeholders
        $scriptTemplate = file_get_contents(storage_path('app/widget-script.js'));

        // In production, you'd have a real template with placeholders like {{WIDGET_ID}}
        $script = str_replace('{{WIDGET_ID}}', $widget->widget_id, $scriptTemplate);
        $script = str_replace('{{API_URL}}', config('app.url'), $script);

        return response($script)
            ->header('Content-Type', 'application/javascript')
            ->header('Cache-Control', 'max-age=3600, public');
    }

    /**
     * Process chat message.
     */
    public function chat(Request $request, string $widgetId): JsonResponse
    {
        $widget = Widget::where('widget_id', $widgetId)
            ->where('is_active', true)
            ->where('is_published', true)
            ->firstOrFail();

        // Validate request
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
            'conversation_id' => 'sometimes|string',
            'user_data' => 'sometimes|array',
        ]);

        // Increment interactions count
        $widget->incrementInteractions();

        // Here you would integrate with your AI backend for actual message processing
        // For now, we'll just echo back a response
        return response()->json([
            'status' => 'success',
            'data' => [
                'conversation_id' => $request->input('conversation_id', uniqid('conv-')),
                'response' => 'Thank you for your message! This is a placeholder response. In a production environment, this would be processed by your AI system.',
                'timestamp' => now()->toIso8601String(),
            ]
        ]);
    }

    /**
     * Record widget analytics.
     */
    public function recordAnalytics(Request $request, string $widgetId): JsonResponse
    {
        try {
            // Validate basic request parameters first
            $validated = $request->validate([
                'event_type' => 'required|string|in:view,open,close,message,feedback',
                'page_url' => 'required|string|max:1000',
                'user_agent' => 'sometimes|string|max:500',
                'referrer' => 'sometimes|string|max:1000',
                'device_type' => 'sometimes|string|in:desktop,tablet,mobile',
                'metadata' => 'sometimes|array',
            ]);

            // Allow form submissions with no widget ID when forms are disabled
            // This helps prevent errors in the embed script
            if (!$widgetId || $widgetId === 'undefined' || $widgetId === 'null') {
                Log::info('Analytics received with invalid widget ID', [
                    'event_type' => $validated['event_type'],
                    'widget_id' => $widgetId
                ]);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Analytics request processed (invalid widget ID)'
                ]);
            }

            // Attempt to find the widget
            $widget = Widget::where('widget_id', $widgetId)
                ->where('is_active', true)
                ->first();

            // If widget not found or inactive, handle gracefully
            if (!$widget) {
                Log::info('Analytics received for inactive or non-existent widget', [
                    'event_type' => $validated['event_type'],
                    'widget_id' => $widgetId
                ]);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Analytics processed (widget not found or inactive)'
                ]);
            }

            // Only record analytics if enabled for this widget
            if (!($widget->embedding_config['enableAnalytics'] ?? true)) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Analytics disabled for this widget'
                ]);
            }

            // Special handling for form data based on form type
            if ($validated['event_type'] === 'feedback') {
                // Check if feedback form is enabled for this widget
                $feedbackEnabled = $widget->content_config['enableFeedback'] ?? false;

                if (!$feedbackEnabled) {
                    Log::info('Feedback analytics received but feedback form is disabled', [
                        'widget_id' => $widget->id
                    ]);

                    return response()->json([
                        'status' => 'success',
                        'message' => 'Form submission acknowledged (feedback form is disabled)'
                    ]);
                }
            }
            // Handle pre-chat form data
            elseif (isset($validated['metadata']['form_type']) && $validated['metadata']['form_type'] === 'pre_chat') {
                // Check if pre-chat form is enabled for this widget
                $preChatEnabled = $widget->content_config['enablePreChatForm'] ?? false;

                if (!$preChatEnabled) {
                    Log::info('Pre-chat form analytics received but pre-chat form is disabled', [
                        'widget_id' => $widget->id
                    ]);

                    return response()->json([
                        'status' => 'success',
                        'message' => 'Form submission acknowledged (pre-chat form is disabled)'
                    ]);
                }
            }

            // Create analytics record
            $analytics = new WidgetAnalytics();
            $analytics->widget_id = $widget->id;
            $analytics->event_type = $validated['event_type'];
            $analytics->page_url = $validated['page_url'];
            $analytics->user_agent = $validated['user_agent'] ?? null;
            $analytics->referrer = $validated['referrer'] ?? null;
            $analytics->device_type = $validated['device_type'] ?? null;
            $analytics->metadata = $validated['metadata'] ?? null;
            $analytics->ip_address = $request->ip();
            $analytics->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Analytics recorded successfully'
            ]);
        } catch (ModelNotFoundException $e) {
            // Log the error but return a success response to prevent breaking the widget
            Log::warning("Widget analytics - Widget not found: {$widgetId}");

            return response()->json([
                'status' => 'success',
                'message' => 'Analytics request processed'
            ]);
        } catch (\Exception $e) {
            // Log any other errors but don't expose details to client
            Log::error("Widget analytics error: {$e->getMessage()}", [
                'widget_id' => $widgetId,
                'event_type' => $request->input('event_type'),
                'exception' => $e
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Analytics request processed'
            ]);
        }
    }
}
