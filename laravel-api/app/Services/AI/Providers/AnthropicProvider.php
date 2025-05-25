<?php

declare(strict_types=1);

namespace App\Services\AI\Providers;

use App\Services\AI\Exceptions\AIProviderException;
use Anthropic\Anthropic;
use Anthropic\Resources\Messages;

class AnthropicProvider extends BaseProvider
{
    /**
     * Anthropic client instance.
     */
    protected ?Anthropic $client = null;

    /**
     * Get the Anthropic client instance.
     */
    protected function getClient(): Anthropic
    {
        if ($this->client === null) {
            $apiKey = $this->getConfig('api_key');

            if (empty($apiKey)) {
                throw new AIProviderException('Anthropic API key is not configured');
            }

            $this->client = new Anthropic([
                'api_key' => $apiKey,
            ]);
        }

        return $this->client;
    }

    /**
     * Generate text with the specified model.
     */
    public function generateText(string $prompt, string $model, array $options = []): string|array
    {
        return $this->generateChat([
            ['role' => 'user', 'content' => $prompt]
        ], $model, $options);
    }

    /**
     * Generate completion with the specified model.
     */
    public function generateCompletion(string $prompt, string $model, array $options = []): string|array
    {
        return $this->generateChat([
            ['role' => 'user', 'content' => $prompt]
        ], $model, $options);
    }

    /**
     * Generate chat with the specified model.
     */
    public function generateChat(array $messages, string $model, array $options = []): string|array
    {
        $this->applyRateLimit('anthropic');

        $messagesString = json_encode($messages);
        $cacheKey = $this->generateCacheKey('chat', $messagesString, $model, $options);
        $cachedResult = $this->getFromCache($cacheKey);

        if ($cachedResult !== null) {
            return $cachedResult;
        }

        try {
            $modelConfig = $this->getModelConfig($model);

            // Convert Laravel format to Anthropic format
            $formattedMessages = array_map(function ($message) {
                return [
                    'role' => $message['role'],
                    'content' => $message['content'],
                ];
            }, $messages);

            $params = array_merge([
                'model' => $model,
                'messages' => $formattedMessages,
                'max_tokens' => $modelConfig['max_tokens'] ?? 1024,
                'temperature' => $modelConfig['temperature'] ?? 0.7,
            ], $options);

            $response = $this->getClient()->messages->create($params);

            $result = json_decode(json_encode($response), true);

            return $this->cacheResult($cacheKey, $result);
        } catch (\Exception $e) {
            $this->handleApiError($e);
        }
    }
}
