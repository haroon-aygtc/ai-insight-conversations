<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\AI\Exceptions\AIProviderException;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use App\Facades\AI;

class AIController extends Controller
{
    /**
     * Generate text using the default or specified AI provider.
     */
    public function generateText(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'prompt' => 'required|string',
            'provider' => 'nullable|string',
            'model' => 'nullable|string',
            'options' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $provider = $request->input('provider');
            $model = $request->input('model');
            $options = $request->input('options', []);

            $aiService = AI::provider($provider)->model($model);
            $result = $aiService->generateText($request->input('prompt'), $options);

            return response()->json(['result' => $result]);
        } catch (AIProviderException $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Generate a chat completion using the default or specified AI provider.
     */
    public function generateChat(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'messages' => 'required|array',
            'messages.*.role' => 'required|string|in:system,user,assistant',
            'messages.*.content' => 'required|string',
            'provider' => 'nullable|string',
            'model' => 'nullable|string',
            'options' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $provider = $request->input('provider');
            $model = $request->input('model');
            $options = $request->input('options', []);

            $aiService = AI::provider($provider)->model($model);
            $result = $aiService->generateChat($request->input('messages'), $options);

            return response()->json(['result' => $result]);
        } catch (AIProviderException $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Generate an image using the default or specified AI provider.
     */
    public function generateImage(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'prompt' => 'required|string',
            'provider' => 'nullable|string',
            'model' => 'nullable|string',
            'options' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $provider = $request->input('provider');
            $model = $request->input('model');
            $options = $request->input('options', []);

            $aiService = AI::provider($provider)->model($model);
            $result = $aiService->generateImage($request->input('prompt'), $options);

            return response()->json(['result' => $result]);
        } catch (AIProviderException $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Generate embeddings using the default or specified AI provider.
     */
    public function generateEmbeddings(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'text' => 'required|string',
            'provider' => 'nullable|string',
            'model' => 'nullable|string',
            'options' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $provider = $request->input('provider');
            $model = $request->input('model');
            $options = $request->input('options', []);

            $aiService = AI::provider($provider)->model($model);
            $result = $aiService->generateEmbeddings($request->input('text'), $options);

            return response()->json(['result' => $result]);
        } catch (AIProviderException $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get available AI providers and models.
     */
    public function getProviders(): JsonResponse
    {
        $providers = config('ai.providers');

        // Format response to only include necessary info
        $formattedProviders = [];
        foreach ($providers as $name => $config) {
            $models = array_keys($config['models'] ?? []);
            $formattedProviders[$name] = [
                'default_model' => $config['default_model'] ?? null,
                'models' => $models,
            ];
        }

        return response()->json(['providers' => $formattedProviders]);
    }
}
