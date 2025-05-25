<?php

declare(strict_types=1);

namespace App\Services\AI\Providers;

use App\Services\AI\Exceptions\AIProviderException;
use Illuminate\Support\Facades\Http;

class HuggingFaceProvider extends BaseProvider
{
    /**
     * API base URL.
     */
    protected string $apiUrl = 'https://api-inference.huggingface.co/models/';

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
        $cacheKey = $this->generateCacheKey('completion', $prompt, $model, $options);
        $cachedResult = $this->getFromCache($cacheKey);

        if ($cachedResult !== null) {
            return $cachedResult;
        }

        try {
            $apiKey = $this->getConfig('api_key');

            if (empty($apiKey)) {
                throw new AIProviderException('HuggingFace API key is not configured');
            }

            $modelConfig = $this->getModelConfig($model);

            $params = array_merge([
                'inputs' => $prompt,
                'parameters' => [
                    'max_new_tokens' => $modelConfig['max_tokens'] ?? 1024,
                    'temperature' => $modelConfig['temperature'] ?? 0.7,
                    'return_full_text' => false,
                ],
            ], $options);

            $response = Http::withHeaders([
                'Authorization' => "Bearer {$apiKey}",
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl . $model, $params);

            if ($response->failed()) {
                throw new AIProviderException('HuggingFace API request failed: ' . $response->body());
            }

            $result = $response->json();

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
        $messagesString = json_encode($messages);
        $cacheKey = $this->generateCacheKey('chat', $messagesString, $model, $options);
        $cachedResult = $this->getFromCache($cacheKey);

        if ($cachedResult !== null) {
            return $cachedResult;
        }

        try {
            $apiKey = $this->getConfig('api_key');

            if (empty($apiKey)) {
                throw new AIProviderException('HuggingFace API key is not configured');
            }

            $modelConfig = $this->getModelConfig($model);

            // Convert message format to text prompt
            $prompt = $this->convertMessagesToPrompt($messages);

            $params = array_merge([
                'inputs' => $prompt,
                'parameters' => [
                    'max_new_tokens' => $modelConfig['max_tokens'] ?? 1024,
                    'temperature' => $modelConfig['temperature'] ?? 0.7,
                    'return_full_text' => false,
                ],
            ], $options);

            $response = Http::withHeaders([
                'Authorization' => "Bearer {$apiKey}",
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl . $model, $params);

            if ($response->failed()) {
                throw new AIProviderException('HuggingFace API request failed: ' . $response->body());
            }

            $result = $response->json();

            return $this->cacheResult($cacheKey, $result);
        } catch (\Exception $e) {
            $this->handleApiError($e);
        }
    }

    /**
     * Convert messages array to text prompt.
     */
    protected function convertMessagesToPrompt(array $messages): string
    {
        $prompt = "";

        foreach ($messages as $message) {
            switch ($message['role']) {
                case 'system':
                    $prompt .= "<|system|>\n" . $message['content'] . "\n";
                    break;
                case 'user':
                    $prompt .= "<|user|>\n" . $message['content'] . "\n";
                    break;
                case 'assistant':
                    $prompt .= "<|assistant|>\n" . $message['content'] . "\n";
                    break;
            }
        }

        $prompt .= "<|assistant|>\n";

        return $prompt;
    }
}
