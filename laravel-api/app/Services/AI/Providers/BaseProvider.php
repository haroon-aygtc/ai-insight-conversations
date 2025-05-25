<?php

declare(strict_types=1);

namespace App\Services\AI\Providers;

use App\Services\AI\Contracts\AIProviderInterface;
use App\Services\AI\Exceptions\AIProviderException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

abstract class BaseProvider implements AIProviderInterface
{
    /**
     * The provider configuration.
     */
    protected array $config;

    /**
     * Create a new provider instance.
     */
    public function __construct(array $config)
    {
        $this->config = $config;
    }

    /**
     * Get configuration value.
     */
    protected function getConfig(string $key, $default = null)
    {
        return $this->config[$key] ?? $default;
    }

    /**
     * Get model configuration.
     */
    protected function getModelConfig(string $model): array
    {
        if (!isset($this->config['models'][$model])) {
            throw new AIProviderException("Model [$model] not configured for this provider.");
        }

        return $this->config['models'][$model];
    }

    /**
     * Cache the result if caching is enabled.
     */
    protected function cacheResult(string $key, $result, ?int $ttl = null): mixed
    {
        if (config('ai.cache.enabled', false)) {
            $ttl = $ttl ?? config('ai.cache.ttl', 3600);
            Cache::put($key, $result, $ttl);
        }

        return $result;
    }

    /**
     * Get result from cache if available.
     */
    protected function getFromCache(string $key): mixed
    {
        if (config('ai.cache.enabled', false) && Cache::has($key)) {
            return Cache::get($key);
        }

        return null;
    }

    /**
     * Generate a cache key for AI requests.
     */
    protected function generateCacheKey(string $type, string $input, string $model, array $options = []): string
    {
        $serializedOptions = json_encode($options);
        return md5("{$type}:{$input}:{$model}:{$serializedOptions}");
    }

    /**
     * Handle API errors gracefully.
     */
    protected function handleApiError(\Throwable $e): void
    {
        Log::error('AI Provider Error', [
            'provider' => static::class,
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);

        throw new AIProviderException("API Error: {$e->getMessage()}", $e->getCode(), $e);
    }

    /**
     * Rate limit requests to the API.
     */
    protected function applyRateLimit(string $provider): void
    {
        $maxRequestsPerMinute = config("ai.rate_limits.{$provider}.max_requests_per_minute", 60);
        $cacheKey = "ai_rate_limit:{$provider}:" . now()->format('YmdHi');

        $currentCount = Cache::get($cacheKey, 0);

        if ($currentCount >= $maxRequestsPerMinute) {
            throw new AIProviderException("Rate limit exceeded for {$provider}. Try again later.");
        }

        Cache::put($cacheKey, $currentCount + 1, 60);
    }

    /**
     * Generate image with the specified model.
     * Default implementation throws exception - providers must implement if they support images
     */
    public function generateImage(string $prompt, string $model, array $options = []): string|array
    {
        throw new AIProviderException("Image generation not supported by this provider.");
    }

    /**
     * Generate embeddings with the specified model.
     * Default implementation throws exception - providers must implement if they support embeddings
     */
    public function generateEmbeddings(string $text, string $model, array $options = []): string|array
    {
        throw new AIProviderException("Embeddings not supported by this provider.");
    }
}
