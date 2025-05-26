<?php

namespace App\Http\Controllers;

use App\Models\FormTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FormTemplateController extends Controller
{
    /**
     * Get all form templates.
     */
    public function index(Request $request): JsonResponse
    {
        $type = $request->query('type');
        $defaultOnly = $request->boolean('default');

        $query = FormTemplate::query();

        if ($type) {
            $query->byType($type);
        }

        if ($defaultOnly) {
            $query->default();
        }

        $templates = $query->get();

        return response()->json(['templates' => $templates]);
    }

    /**
     * Get a specific form template.
     */
    public function show(FormTemplate $template): JsonResponse
    {
        return response()->json(['template' => $template]);
    }

    /**
     * Get default form template by type.
     */
    public function getDefaultByType(string $type): JsonResponse
    {
        $template = FormTemplate::byType($type)->default()->first();

        if (!$template) {
            return response()->json(['message' => "No default template found for type: {$type}"], 404);
        }

        return response()->json(['template' => $template]);
    }
}
