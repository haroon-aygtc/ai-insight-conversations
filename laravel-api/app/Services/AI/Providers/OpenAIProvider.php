<?php

declare(strict_types=1);

namespace App\Services\AI\Providers;

use App\Services\AI\Exceptions\AIProviderException;
use OpenAI;

class OpenAIProvider extends BaseProvider
{
    /**
     * OpenAI client instance.
     */
    protected ?OpenAI\Client $client = null;

    /**
     * Get the OpenAI client instance.
     */
    protected function getClient(): OpenAI\Client
    {
        if ($this->client === null) {
            $apiKey = $this->getConfig('api_key');
            $organization = $this->getConfig('organization');

            if (empty($apiKey)) {
                throw new AIProviderException('OpenAI API key is not configured');
            }

            $clientOptions = [
                'api_key' => $apiKey,
            ];

            if (!empty($organization)) {
                $clientOptions['organization'] = $organization;
            }

            $this->client = OpenAI::client($apiKey, $organization);
        }

        return $this->client;
    }

    /**
     * Generate text with the specified model.
     */
    public function generateText(string $prompt, string $model, array $options = []): string|array
    {
        return $this->generateCompletion($prompt, $model, $options);
    }

    /**
     * Generate completion with the specified model.
     */
    public function generateCompletion(string $prompt, string $model, array $options = []): string|array
    {
        $this->applyRateLimit('openai');

        $cacheKey = $this->generateCacheKey('completion', $prompt, $model, $options);
        $cachedResult = $this->getFromCache($cacheKey);

        if ($cachedResult !== null) {
            return $cachedResult;
        }

        try {
            $modelConfig = $this->getModelConfig($model);

            $params = array_merge([
                'model' => $model,
                'prompt' => $prompt,
                'max_tokens' => $modelConfig['max_tokens'] ?? 1024,
                'temperature' => $modelConfig['temperature'] ?? 0.7,
            ], $options);

            $response = $this->getClient()->completions()->create($params);

            $result = $response->toArray();

            return $this->cacheResult($cacheKey, $result);
        } catch (\Exception $e) {
            $this->handleApiError($e);
        }
    }

    /**
     * Generate chat with the specified model.
     */
    public function generateChat(array $messages, string $model, array $options = []): string|array
    {
        $this->applyRateLimit('openai');

        $messagesString = json_encode($messages);
        $cacheKey = $this->generateCacheKey('chat', $messagesString, $model, $options);
        $cachedResult = $this->getFromCache($cacheKey);

        if ($cachedResult !== null) {
            return $cachedResult;
        }

        try {
            $modelConfig = $this->getModelConfig($model);

            $params = array_merge([
                'model' => $model,
                'messages' => $messages,
                'max_tokens' => $modelConfig['max_tokens'] ?? 1024,
                'temperature' => $modelConfig['temperature'] ?? 0.7,
            ], $options);

            $response = $this->getClient()->chat()->create($params);

            $result = $response->toArray();

            return $this->cacheResult($cacheKey, $result);
        } catch (\Exception $e) {
            $this->handleApiError($e);
        }
    }

    /**
     * Generate image with the specified model.
     */
    public function generateImage(string $prompt, string $model, array $options = []): string|array
    {
        $this->applyRateLimit('openai');

        $cacheKey = $this->generateCacheKey('image', $prompt, $model, $options);
        $cachedResult = $this->getFromCache($cacheKey);

        if ($cachedResult !== null) {
            return $cachedResult;
        }

        try {
            $params = array_merge([
                'prompt' => $prompt,
                'n' => 1,
                'size' => '1024x1024',
                'response_format' => 'url',
            ], $options);

            $response = $this->getClient()->images()->create($params);

            $result = $response->toArray();

            return $this->cacheResult($cacheKey, $result);
        } catch (\Exception $e) {
            $this->handleApiError($e);
        }
    }

    /**
     * Generate embeddings with the specified model.
     */
    public function generateEmbeddings(string $text, string $model, array $options = []): string|array
    {
        $this->applyRateLimit('openai');

        $cacheKey = $this->generateCacheKey('embeddings', $text, $model, $options);
        $cachedResult = $this->getFromCache($cacheKey);

        if ($cachedResult !== null) {
            return $cachedResult;
        }

        try {
            $params = array_merge([
                'model' => $model,
                'input' => $text,
            ], $options);

            $response = $this->getClient()->embeddings()->create($params);

            $result = $response->toArray();

            return $this->cacheResult($cacheKey, $result);
        } catch (\Exception $e) {
            $this->handleApiError($e);
        }
    }
}
