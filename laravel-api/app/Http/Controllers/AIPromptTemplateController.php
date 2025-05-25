<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\AIPromptTemplate;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class AIPromptTemplateController extends Controller
{
    /**
     * Get all prompt templates.
     */
    public function index(Request $request): JsonResponse
    {
        $query = AIPromptTemplate::query();
        
        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->input('category'));
        }
        
        // Filter by use case
        if ($request->has('use_case')) {
            $query->where('use_case', $request->input('use_case'));
        }
        
        // Filter by system prompts
        if ($request->has('is_system_prompt')) {
            $query->where('is_system_prompt', $request->boolean('is_system_prompt'));
        }
        
        // Filter by user
        if ($request->has('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }
        
        $templates = $query->get();
        
        return response()->json(['templates' => $templates]);
    }

    /**
     * Get a specific prompt template.
     */
    public function show(int $id): JsonResponse
    {
        $template = AIPromptTemplate::find($id);
        
        if (!$template) {
            return response()->json(['error' => 'Prompt template not found'], 404);
        }
        
        return response()->json(['template' => $template]);
    }

    /**
     * Create a new prompt template.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'template' => 'required|string',
            'variables' => 'nullable|array',
            'category' => 'nullable|string|max:255',
            'use_case' => 'nullable|string|max:255',
            'is_system_prompt' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $template = AIPromptTemplate::create([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'template' => $request->input('template'),
            'variables' => $request->input('variables'),
            'category' => $request->input('category'),
            'use_case' => $request->input('use_case'),
            'is_system_prompt' => $request->input('is_system_prompt', false),
            'user_id' => $request->user()->id,
        ]);
        
        return response()->json(['template' => $template], 201);
    }

    /**
     * Update a prompt template.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $template = AIPromptTemplate::find($id);
        
        if (!$template) {
            return response()->json(['error' => 'Prompt template not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'template' => 'string',
            'variables' => 'nullable|array',
            'category' => 'nullable|string|max:255',
            'use_case' => 'nullable|string|max:255',
            'is_system_prompt' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $template->update($request->all());
        
        return response()->json(['template' => $template]);
    }

    /**
     * Delete a prompt template.
     */
    public function destroy(int $id): JsonResponse
    {
        $template = AIPromptTemplate::find($id);
        
        if (!$template) {
            return response()->json(['error' => 'Prompt template not found'], 404);
        }
        
        $template->delete();
        
        return response()->json(['message' => 'Prompt template deleted successfully']);
    }

    /**
     * Render a prompt template with variables.
     */
    public function render(Request $request, int $id): JsonResponse
    {
        $template = AIPromptTemplate::find($id);
        
        if (!$template) {
            return response()->json(['error' => 'Prompt template not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'variables' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $renderedTemplate = $template->render($request->input('variables'));
        
        return response()->json([
            'rendered_template' => $renderedTemplate,
            'original_template' => $template->template,
            'variables' => $request->input('variables'),
        ]);
    }
}
