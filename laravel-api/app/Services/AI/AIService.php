<?php

declare(strict_types=1);

namespace App\Services\AI;

use App\Models\AIProvider;
use App\Models\AIModel;
use App\Services\AI\Exceptions\AIProviderException;
use Illuminate\Support\Facades\Config;

class AIService
{
    /**
     * The AIManager instance.
     */
    protected AIManager $manager;

    /**
     * Create a new AIService instance.
     */
    public function __construct(AIManager $manager)
    {
        $this->manager = $manager;
    }

    /**
     * Get all available AI providers.
     */
    public function getProviders(): array
    {
        // First check if we have providers in the database
        $dbProviders = AIProvider::with('models')->get();
        
        if ($dbProviders->isNotEmpty()) {
            return $dbProviders->toArray();
        }
        
        // Fall back to config-based providers
        $providers = Config::get('ai.providers', []);
        $result = [];
        
        foreach ($providers as $key => $provider) {
            $result[] = [
                'id' => $key,
                'name' => ucfirst($key),
                'key' => $key,
                'type' => $key,
                'enabled' => $provider['enabled'] ?? true,
                'is_default' => Config::get('ai.default') === $key,
                'models' => $this->formatModelsFromConfig($provider['models'] ?? []),
                'icon_color' => $this->getProviderColor($key),
                'configuration' => $this->filterSensitiveData($provider),
            ];
        }
        
        return $result;
    }

    /**
     * Get the default AI provider.
     */
    public function getDefaultProvider(): ?array
    {
        // First check if we have a default provider in the database
        $dbProvider = AIProvider::with('models')->where('is_default', true)->first();
        
        if ($dbProvider) {
            return $dbProvider->toArray();
        }
        
        // Fall back to config-based default provider
        $defaultKey = Config::get('ai.default');
        $provider = Config::get("ai.providers.{$defaultKey}");
        
        if (!$provider) {
            return null;
        }
        
        return [
            'id' => $defaultKey,
            'name' => ucfirst($defaultKey),
            'key' => $defaultKey,
            'type' => $defaultKey,
            'enabled' => $provider['enabled'] ?? true,
            'is_default' => true,
            'models' => $this->formatModelsFromConfig($provider['models'] ?? []),
            'icon_color' => $this->getProviderColor($defaultKey),
            'configuration' => $this->filterSensitiveData($provider),
        ];
    }

    /**
     * Generate text with the specified provider and model.
     */
    public function generateText(string $prompt, ?string $provider = null, ?string $model = null, array $options = []): string|array
    {
        return $this->manager
            ->provider($provider)
            ->model($model)
            ->generateText($prompt, $options);
    }

    /**
     * Generate chat with the specified provider and model.
     */
    public function generateChat(array $messages, ?string $provider = null, ?string $model = null, array $options = []): string|array
    {
        return $this->manager
            ->provider($provider)
            ->model($model)
            ->generateChat($messages, $options);
    }

    /**
     * Generate image with the specified provider and model.
     */
    public function generateImage(string $prompt, ?string $provider = null, ?string $model = null, array $options = []): string|array
    {
        return $this->manager
            ->provider($provider)
            ->model($model)
            ->generateImage($prompt, $options);
    }

    /**
     * Generate embeddings with the specified provider and model.
     */
    public function generateEmbeddings(string $text, ?string $provider = null, ?string $model = null, array $options = []): string|array
    {
        return $this->manager
            ->provider($provider)
            ->model($model)
            ->generateEmbeddings($text, $options);
    }

    /**
     * Format models from config for frontend.
     */
    protected function formatModelsFromConfig(array $models): array
    {
        $result = [];
        $index = 1;

        foreach ($models as $name => $config) {
            $result[] = [
                'id' => (string) $index++,
                'name' => $name,
                'enabled' => true,
                'max_tokens' => $config['max_tokens'] ?? 1024,
                'temperature' => $config['temperature'] ?? 0.7,
                'is_default' => false,
            ];
        }

        return $result;
    }

    /**
     * Filter out sensitive data from provider configuration.
     */
    protected function filterSensitiveData(array $config): array
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
    protected function maskString(string $value): string
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
    protected function getProviderColor(string $provider): string
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
