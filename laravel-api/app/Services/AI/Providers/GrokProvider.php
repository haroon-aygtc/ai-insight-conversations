<?php

declare(strict_types=1);

namespace App\Services\AI\Providers;

use App\Services\AI\Exceptions\AIProviderException;
use Illuminate\Support\Facades\Http;

class GrokProvider extends BaseProvider
{
    /**
     * API base URL.
     */
    protected string $apiUrl = 'https://api.grok.x/v1/';

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
        $messagesString = json_encode($messages);
        $cacheKey = $this->generateCacheKey('chat', $messagesString, $model, $options);
        $cachedResult = $this->getFromCache($cacheKey);

        if ($cachedResult !== null) {
            return $cachedResult;
        }

        try {
            $apiKey = $this->getConfig('api_key');

            if (empty($apiKey)) {
                throw new AIProviderException('Grok API key is not configured');
            }

            $modelConfig = $this->getModelConfig($model);

            // Grok API follows OpenAI format
            $formattedMessages = array_map(function ($message) {
                return [
                    'role' => $message['role'],
                    'content' => $message['content'],
                ];
            }, $messages);

            $params = array_merge([
                'model' => $model,
                'messages' => $formattedMessages,
                'max_tokens' => $modelConfig['max_tokens'] ?? 4096,
                'temperature' => $modelConfig['temperature'] ?? 0.7,
            ], $options);

            $response = Http::withHeaders([
                'Authorization' => "Bearer {$apiKey}",
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl . 'chat/completions', $params);

            if ($response->failed()) {
                throw new AIProviderException('Grok API request failed: ' . $response->body());
            }

            $result = $response->json();

            return $this->cacheResult($cacheKey, $result);
        } catch (\Exception $e) {
            $this->handleApiError($e);
        }
    }
}
