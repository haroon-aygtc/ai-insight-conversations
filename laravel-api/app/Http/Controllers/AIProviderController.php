<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Facades\AI;
use App\Models\AIProvider;
use App\Models\AIModel;
use App\Services\AI\Exceptions\AIProviderException;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Validator;

class AIProviderController extends Controller
{
    /**
     * Get all available AI providers.
     */
    public function index(): JsonResponse
    {
        // First check if we have providers in the database
        $dbProviders = AIProvider::with('models')->get();
        
        if ($dbProviders->isNotEmpty()) {
            return response()->json(['providers' => $dbProviders]);
        }
        
        // Fall back to config-based providers if no database records exist
        $providers = Config::get('ai.providers', []);

        $result = [];
        foreach ($providers as $key => $provider) {
            $result[] = [
                'id' => $key,
                'name' => ucfirst($key),
                'key' => $key,
                'type' => $key,
                'enabled' => $provider['enabled'] ?? true,
                'isDefault' => Config::get('ai.default') === $key,
                'models' => $this->formatModels($provider['models'] ?? []),
                'iconColor' => $this->getProviderColor($key),
                'configuration' => $this->filterSensitiveData($provider),
            ];
        }

        return response()->json(['providers' => $result]);
    }

    /**
     * Get a specific provider.
     */
    public function show(string $id): JsonResponse
    {
        // First try to find the provider in the database
        if (is_numeric($id)) {
            $dbProvider = AIProvider::with('models')->find($id);
            if ($dbProvider) {
                return response()->json(['provider' => $dbProvider]);
            }
        }
        
        // Fall back to config-based provider
        $provider = Config::get("ai.providers.{$id}");

        if (!$provider) {
            return response()->json(['error' => 'Provider not found'], 404);
        }

        $result = [
            'id' => $id,
            'name' => ucfirst($id),
            'key' => $id,
            'type' => $id,
            'enabled' => $provider['enabled'] ?? true,
            'isDefault' => Config::get('ai.default') === $id,
            'models' => $this->formatModels($provider['models'] ?? []),
            'iconColor' => $this->getProviderColor($id),
            'configuration' => $this->filterSensitiveData($provider),
        ];

        return response()->json(['provider' => $result]);
    }

    /**
     * Create a new provider.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'key' => 'required|string|unique:ai_providers,key',
            'type' => 'required|string',
            'enabled' => 'boolean',
            'is_default' => 'boolean',
            'configuration' => 'array',
            'icon_color' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // If this provider is set as default, unset any other default providers
        if ($request->input('is_default', false)) {
            AIProvider::where('is_default', true)->update(['is_default' => false]);
        }

        $provider = AIProvider::create([
            'name' => $request->input('name'),
            'key' => $request->input('key'),
            'type' => $request->input('type'),
            'enabled' => $request->input('enabled', true),
            'is_default' => $request->input('is_default', false),
            'configuration' => $request->input('configuration', []),
            'icon_color' => $request->input('icon_color', $this->getProviderColor($request->input('type'))),
        ]);

        // Create models if provided
        if ($request->has('models') && is_array($request->input('models'))) {
            foreach ($request->input('models') as $modelData) {
                if (isset($modelData['name'])) {
                    $provider->models()->create([
                        'name' => $modelData['name'],
                        'enabled' => $modelData['enabled'] ?? true,
                        'max_tokens' => $modelData['max_tokens'] ?? 1024,
                        'temperature' => $modelData['temperature'] ?? 0.7,
                        'is_default' => $modelData['is_default'] ?? false,
                        'capabilities' => $modelData['capabilities'] ?? null,
                    ]);
                }
            }
        }

        return response()->json(['provider' => $provider->load('models')], 201);
    }

    /**
     * Update a provider.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        // First try to find the provider in the database
        $dbProvider = null;
        if (is_numeric($id)) {
            $dbProvider = AIProvider::find($id);
        } else {
            $dbProvider = AIProvider::where('key', $id)->first();
        }
        
        if ($dbProvider) {
            $validator = Validator::make($request->all(), [
                'name' => 'string',
                'key' => 'string|unique:ai_providers,key,' . $dbProvider->id,
                'type' => 'string',
                'enabled' => 'boolean',
                'is_default' => 'boolean',
                'configuration' => 'array',
                'icon_color' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            // If this provider is set as default, unset any other default providers
            if ($request->input('is_default', false) && !$dbProvider->is_default) {
                AIProvider::where('is_default', true)->update(['is_default' => false]);
            }

            $dbProvider->update($request->all());
            
            return response()->json(['provider' => $dbProvider->fresh()->load('models')]);
        }
        
        // Fall back to config-based provider
        $provider = Config::get("ai.providers.{$id}");

        if (!$provider) {
            return response()->json(['error' => 'Provider not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string',
            'enabled' => 'boolean',
            'models' => 'array',
            'configuration' => 'array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // In a real implementation, this would update the config file or database
        // For this demo, we'll just return the merged data

        $result = [
            'id' => $id,
            'name' => $request->input('name', ucfirst($id)),
            'key' => $id,
            'type' => $id,
            'enabled' => $request->input('enabled', $provider['enabled'] ?? true),
            'isDefault' => Config::get('ai.default') === $id,
            'models' => $request->input('models', $this->formatModels($provider['models'] ?? [])),
            'iconColor' => $this->getProviderColor($id),
            'configuration' => $this->filterSensitiveData($request->input('configuration', $provider)),
        ];

        return response()->json(['provider' => $result]);
    }

    /**
     * Delete a provider.
     */
    public function destroy(string $id): JsonResponse
    {
        // First try to find the provider in the database
        $dbProvider = null;
        if (is_numeric($id)) {
            $dbProvider = AIProvider::find($id);
        } else {
            $dbProvider = AIProvider::where('key', $id)->first();
        }
        
        if ($dbProvider) {
            $dbProvider->delete();
            return response()->json(['message' => 'Provider deleted successfully']);
        }
        
        // Fall back to config-based provider
        $provider = Config::get("ai.providers.{$id}");

        if (!$provider) {
            return response()->json(['error' => 'Provider not found'], 404);
        }

        // In a real implementation, this would update the config file or database
        // For this demo, we'll just return a success message

        return response()->json(['message' => 'Provider deleted successfully']);
    }

    /**
     * Set a provider as default.
     */
    public function setDefault(string $id): JsonResponse
    {
        // First try to find the provider in the database
        $dbProvider = null;
        if (is_numeric($id)) {
            $dbProvider = AIProvider::find($id);
        } else {
            $dbProvider = AIProvider::where('key', $id)->first();
        }
        
        if ($dbProvider) {
            // Unset any other default providers
            AIProvider::where('is_default', true)->update(['is_default' => false]);
            
            // Set this provider as default
            $dbProvider->is_default = true;
            $dbProvider->save();
            
            return response()->json(['provider' => $dbProvider->fresh()->load('models')]);
        }
        
        // Fall back to config-based provider
        $provider = Config::get("ai.providers.{$id}");

        if (!$provider) {
            return response()->json(['error' => 'Provider not found'], 404);
        }

        // In a real implementation, this would update the config file or database
        // For this demo, we'll just return the provider with isDefault set to true

        $result = [
            'id' => $id,
            'name' => ucfirst($id),
            'key' => $id,
            'type' => $id,
            'enabled' => $provider['enabled'] ?? true,
            'isDefault' => true,
            'models' => $this->formatModels($provider['models'] ?? []),
            'iconColor' => $this->getProviderColor($id),
            'configuration' => $this->filterSensitiveData($provider),
        ];

        return response()->json(['provider' => $result]);
    }

    /**
     * Test a provider's connection.
     */
    public function testConnection(string $id): JsonResponse
    {
        $provider = Config::get("ai.providers.{$id}");

        if (!$provider) {
            return response()->json(['error' => 'Provider not found'], 404);
        }

        try {
            // In a real implementation, this would actually test the connection
            // For this demo, we'll simulate a success or failure
            $success = rand(0, 9) < 8; // 80% success rate

            if (!$success) {
                throw new AIProviderException('Failed to connect to the API');
            }

            return response()->json([
                'success' => true,
                'message' => 'Connection successful'
            ]);
        } catch (AIProviderException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Get all models for a provider.
     */
    public function getModels(string $id): JsonResponse
    {
        // First try to find the provider in the database
        $dbProvider = null;
        if (is_numeric($id)) {
            $dbProvider = AIProvider::find($id);
        } else {
            $dbProvider = AIProvider::where('key', $id)->first();
        }
        
        if ($dbProvider) {
            $models = $dbProvider->models;
            return response()->json(['models' => $models]);
        }
        
        // Fall back to config-based provider
        $provider = Config::get("ai.providers.{$id}");

        if (!$provider) {
            return response()->json(['error' => 'Provider not found'], 404);
        }

        $models = $this->formatModels($provider['models'] ?? []);

        return response()->json(['models' => $models]);
    }

    /**
     * Update a model.
     */
    public function updateModel(Request $request, string $providerId, string $modelId): JsonResponse
    {
        // First try to find the provider in the database
        $dbProvider = null;
        if (is_numeric($providerId)) {
            $dbProvider = AIProvider::find($providerId);
        } else {
            $dbProvider = AIProvider::where('key', $providerId)->first();
        }
        
        if ($dbProvider) {
            $model = null;
            if (is_numeric($modelId)) {
                $model = AIModel::where('id', $modelId)
                    ->where('ai_provider_id', $dbProvider->id)
                    ->first();
            } else {
                $model = AIModel::where('name', $modelId)
                    ->where('ai_provider_id', $dbProvider->id)
                    ->first();
            }
            
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
                AIModel::where('ai_provider_id', $dbProvider->id)
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
            }
            
            $model->update($request->all());
            
            return response()->json(['model' => $model->fresh()]);
        }
        
        // Fall back to config-based provider
        $provider = Config::get("ai.providers.{$providerId}");

        if (!$provider) {
            return response()->json(['error' => 'Provider not found'], 404);
        }

        if (!isset($provider['models'][$modelId])) {
            return response()->json(['error' => 'Model not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'enabled' => 'boolean',
            'maxTokens' => 'integer|min:1',
            'temperature' => 'numeric|min:0|max:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // In a real implementation, this would update the config file or database
        // For this demo, we'll just return the updated model

        $model = [
            'id' => $modelId,
            'name' => $modelId,
            'enabled' => $request->input('enabled', true),
            'maxTokens' => $request->input('maxTokens', $provider['models'][$modelId]['max_tokens'] ?? 1024),
            'temperature' => $request->input('temperature', $provider['models'][$modelId]['temperature'] ?? 0.7),
        ];

        return response()->json(['model' => $model]);
    }

    /**
     * Format models for frontend.
     */
    private function formatModels(array $models): array
    {
        $result = [];
        $index = 1;

        foreach ($models as $name => $config) {
            $result[] = [
                'id' => (string) $index++,
                'name' => $name,
                'enabled' => true,
                'maxTokens' => $config['max_tokens'] ?? 1024,
                'temperature' => $config['temperature'] ?? 0.7,
            ];
        }

        return $result;
    }

    /**
     * Filter out sensitive data from provider configuration.
     */
    private function filterSensitiveData(array $config): array
    {
        $filtered = $config;

        // Replace API keys with masked values
        if (isset($filtered['api_key'])) {
            $filtered['api_key'] = $this->maskString($filtered['api_key']);
        }

        // Remove models from configuration (we return them separately)
        unset($filtered['models']);

        return $filtered;
    }

    /**
     * Mask a string, showing only the first and last characters.
     */
    private function maskString(string $value): string
    {
        if (empty($value)) {
            return '';
        }

        $length = strlen($value);

        if ($length <= 8) {
            return str_repeat('*', $length);
        }

        return substr($value, 0, 4) . str_repeat('*', $length - 8) . substr($value, -4);
    }

    /**
     * Get color for provider icon.
     */
    private function getProviderColor(string $provider): string
    {
        $colors = [
            'openai' => 'from-green-500 to-blue-500',
            'anthropic' => 'from-purple-500 to-pink-500',
            'google' => 'from-blue-500 to-cyan-500',
            'huggingface' => 'from-yellow-500 to-orange-500',
            'mistral' => 'from-red-500 to-pink-500',
            'openrouter' => 'from-blue-400 to-indigo-500',
            'deepseek' => 'from-teal-500 to-emerald-500',
            'grok' => 'from-red-500 to-orange-500',
        ];

        return $colors[$provider] ?? 'from-gray-500 to-gray-600';
    }
}
