<?php

namespace App\Http\Controllers;

use App\Models\Widget;
use App\Http\Requests\StoreWidgetRequest;
use App\Http\Requests\UpdateWidgetRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WidgetController extends Controller
{
    /**
     * Display a listing of widgets.
     */
    public function index(): JsonResponse
    {
        $widgets = Widget::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $widgets
        ]);
    }

    /**
     * Store a newly created widget.
     */
    public function store(StoreWidgetRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $widget = new Widget();
        $widget->user_id = Auth::id();
        $widget->name = $validated['name'];
        $widget->description = $validated['description'] ?? null;
        $widget->appearance_config = $validated['appearance_config'] ?? Widget::getDefaultConfig()['appearance'];
        $widget->behavior_config = $validated['behavior_config'] ?? Widget::getDefaultConfig()['behavior'];
        $widget->content_config = $validated['content_config'] ?? Widget::getDefaultConfig()['content'];
        $widget->embedding_config = $validated['embedding_config'] ?? Widget::getDefaultConfig()['embedding'];
        $widget->status = 'draft';
        $widget->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Widget created successfully',
            'data' => $widget
        ], 201);
    }

    /**
     * Display the specified widget.
     */
    public function show(string $id): JsonResponse
    {
        $widget = Widget::where('user_id', Auth::id())
            ->where(function ($query) use ($id) {
                $query->where('id', $id)
                    ->orWhere('widget_id', $id);
            })
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $widget
        ]);
    }

    /**
     * Update the specified widget.
     */
    public function update(UpdateWidgetRequest $request, string $id): JsonResponse
    {
        $widget = Widget::where('user_id', Auth::id())
            ->where(function ($query) use ($id) {
                $query->where('id', $id)
                    ->orWhere('widget_id', $id);
            })
            ->firstOrFail();

        $validated = $request->validated();

        if (isset($validated['name'])) {
            $widget->name = $validated['name'];
        }

        if (isset($validated['description'])) {
            $widget->description = $validated['description'];
        }

        if (isset($validated['appearance_config'])) {
            $widget->appearance_config = $validated['appearance_config'];
        }

        if (isset($validated['behavior_config'])) {
            $widget->behavior_config = $validated['behavior_config'];
        }

        if (isset($validated['content_config'])) {
            $widget->content_config = $validated['content_config'];
        }

        if (isset($validated['embedding_config'])) {
            $widget->embedding_config = $validated['embedding_config'];
        }

        if (isset($validated['is_active'])) {
            $widget->is_active = $validated['is_active'];
        }

        $widget->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Widget updated successfully',
            'data' => $widget
        ]);
    }

    /**
     * Remove the specified widget.
     */
    public function destroy(string $id): JsonResponse
    {
        $widget = Widget::where('user_id', Auth::id())
            ->where(function ($query) use ($id) {
                $query->where('id', $id)
                    ->orWhere('widget_id', $id);
            })
            ->firstOrFail();

        $widget->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Widget deleted successfully'
        ]);
    }

    /**
     * Publish the specified widget.
     */
    public function publish(string $id): JsonResponse
    {
        $widget = Widget::where('user_id', Auth::id())
            ->where(function ($query) use ($id) {
                $query->where('id', $id)
                    ->orWhere('widget_id', $id);
            })
            ->firstOrFail();

        $widget->publish();

        return response()->json([
            'status' => 'success',
            'message' => 'Widget published successfully',
            'data' => $widget
        ]);
    }

    /**
     * Unpublish the specified widget.
     */
    public function unpublish(string $id): JsonResponse
    {
        $widget = Widget::where('user_id', Auth::id())
            ->where(function ($query) use ($id) {
                $query->where('id', $id)
                    ->orWhere('widget_id', $id);
            })
            ->firstOrFail();

        $widget->unpublish();

        return response()->json([
            'status' => 'success',
            'message' => 'Widget unpublished successfully',
            'data' => $widget
        ]);
    }

    /**
     * Get widget embed code.
     */
    public function getEmbedCode(string $id): JsonResponse
    {
        $widget = Widget::where(function ($query) use ($id) {
                $query->where('id', $id)
                    ->orWhere('widget_id', $id);
            })
            ->firstOrFail();

        $embedCode = '<script src="' . config('app.url') . '/widget/' . $widget->widget_id . '/script.js" id="chat-widget" data-id="' . $widget->widget_id . '"></script>';

        return response()->json([
            'status' => 'success',
            'data' => [
                'embed_code' => $embedCode,
                'script_url' => $widget->scriptUrlAttribute,
                'widget_id' => $widget->widget_id
            ]
        ]);
    }
}
