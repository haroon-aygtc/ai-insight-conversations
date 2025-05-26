<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\AIModel;
use App\Models\AIProvider;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class AIModelController extends Controller
{
    /**
     * Get all AI models.
     */
    public function index(): JsonResponse
    {
        $models = AIModel::with('provider')->get();
        
        return response()->json(['models' => $models]);
    }

    /**
     * Get models for a specific provider.
     */
    public function getProviderModels(int $providerId): JsonResponse
    {
        $provider = AIProvider::find($providerId);
        
        if (!$provider) {
            return response()->json(['error' => 'Provider not found'], 404);
        }
        
        $models = $provider->models;
        
        return response()->json(['models' => $models]);
    }

    /**
     * Get a specific model.
     */
    public function show(int $id): JsonResponse
    {
        $model = AIModel::with('provider')->find($id);
        
        if (!$model) {
            return response()->json(['error' => 'Model not found'], 404);
        }
        
        return response()->json(['model' => $model]);
    }

    /**
     * Create a new model.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'ai_provider_id' => 'required|exists:ai_providers,id',
            'name' => 'required|string',
            'enabled' => 'boolean',
            'max_tokens' => 'integer|min:1',
            'temperature' => 'numeric|min:0|max:1',
            'is_default' => 'boolean',
            'capabilities' => 'array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // If this model is set as default, unset any other default models for this provider
        if ($request->input('is_default', false)) {
            AIModel::where('ai_provider_id', $request->input('ai_provider_id'))
                ->where('is_default', true)
                ->update(['is_default' => false]);
        }

        $model = AIModel::create($request->all());
        
        return response()->json(['model' => $model], 201);
    }

    /**
     * Update a model.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $model = AIModel::find($id);
        
        if (!$model) {
            return response()->json(['error' => 'Model not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string',
            'enabled' => 'boolean',
            'max_tokens' => 'integer|min:1',
            'temperature' => 'numeric|min:0|max:1',
            'is_default' => 'boolean',
            'capabilities' => 'array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // If this model is set as default, unset any other default models for this provider
        if ($request->input('is_default', false) && !$model->is_default) {
            AIModel::where('ai_provider_id', $model->ai_provider_id)
                ->where('is_default', true)
                ->update(['is_default' => false]);
        }

        $model->update($request->all());
        
        return response()->json(['model' => $model]);
    }

    /**
     * Delete a model.
     */
    public function destroy(int $id): JsonResponse
    {
        $model = AIModel::find($id);
        
        if (!$model) {
            return response()->json(['error' => 'Model not found'], 404);
        }
        
        $model->delete();
        
        return response()->json(['message' => 'Model deleted successfully']);
    }

    /**
     * Set a model as default for its provider.
     */
    public function setDefault(int $id): JsonResponse
    {
        $model = AIModel::find($id);
        
        if (!$model) {
            return response()->json(['error' => 'Model not found'], 404);
        }
        
        // Unset any other default models for this provider
        AIModel::where('ai_provider_id', $model->ai_provider_id)
            ->where('is_default', true)
            ->update(['is_default' => false]);
        
        $model->is_default = true;
        $model->save();
        
        return response()->json(['model' => $model]);
    }

    /**
     * Test a model's capabilities.
     */
    public function testModel(Request $request, int $id): JsonResponse
    {
        $model = AIModel::with('provider')->find($id);
        
        if (!$model) {
            return response()->json(['error' => 'Model not found'], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'prompt' => 'required|string',
            'test_type' => 'required|string|in:text,chat,image,embeddings',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // In a real implementation, this would test the model with the AI service
        // For this demo, we'll simulate a success or failure
        $success = rand(0, 9) < 8; // 80% success rate
        
        if (!$success) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate response with the model',
            ], 400);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Model test successful',
            'result' => 'This is a simulated response from the AI model.',
        ]);
    }
}
