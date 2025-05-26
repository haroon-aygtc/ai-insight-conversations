<?php

declare(strict_types=1);

namespace App\Services\AI\Providers;

use App\Services\AI\Exceptions\AIProviderException;
use Google\ApiCore\ApiException;
use Google\ApiCore\ValidationException;
use Google\Auth\ApplicationDefaultCredentials;
use Google\Cloud\AIPlatform\V1\PredictionServiceClient;
use Google\Cloud\AIPlatform\V1\GenerateContentRequest;
use Google\Cloud\AIPlatform\V1\GenerateContentResponse;
use Google\Cloud\AIPlatform\V1\Content;
use Google\Cloud\AIPlatform\V1\Part;

class GoogleProvider extends BaseProvider
{
    /**
     * Google Prediction Service client instance.
     */
    protected ?PredictionServiceClient $client = null;

    /**
     * Get the Google Prediction Service client instance.
     */
    protected function getClient(): PredictionServiceClient
    {
        if ($this->client === null) {
            $credentialsFile = $this->getConfig('credentials_file');
            $apiKey = $this->getConfig('api_key');

            if (empty($credentialsFile) && empty($apiKey)) {
                throw new AIProviderException('Google credentials file or API key is not configured');
            }

            try {
                // Set environment variable for authentication
                if (!empty($credentialsFile)) {
                    putenv("GOOGLE_APPLICATION_CREDENTIALS={$credentialsFile}");
                }

                $options = [];
                if (!empty($apiKey)) {
                    $options['credentials'] = ApplicationDefaultCredentials::getCredentials(['https://www.googleapis.com/auth/cloud-platform']);
                    $options['api_key'] = $apiKey;
                }

                $this->client = new PredictionServiceClient($options);
            } catch (ValidationException $e) {
                throw new AIProviderException("Google client initialization error: {$e->getMessage()}", $e->getCode(), $e);
            }
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
        $this->applyRateLimit('google');

        $messagesString = json_encode($messages);
        $cacheKey = $this->generateCacheKey('chat', $messagesString, $model, $options);
        $cachedResult = $this->getFromCache($cacheKey);

        if ($cachedResult !== null) {
            return $cachedResult;
        }

        try {
            $modelConfig = $this->getModelConfig($model);
            $projectId = $this->getConfig('project_id');
            $location = $this->getConfig('location', 'us-central1');

            if (empty($projectId)) {
                throw new AIProviderException('Google Cloud project ID is not configured');
            }

            // Format messages for Google's API
            $contents = [];
            foreach ($messages as $message) {
                $part = new Part();
                $part->setText($message['content']);

                $content = new Content();
                $content->setRole($this->mapRole($message['role']));
                $content->setParts([$part]);

                $contents[] = $content;
            }

            // Prepare the request
            $request = new GenerateContentRequest();
            $request->setContents($contents);

            // Set parameters
            $temperature = $options['temperature'] ?? $modelConfig['temperature'] ?? 0.7;
            $maxTokens = $options['max_tokens'] ?? $modelConfig['max_tokens'] ?? 1024;

            $generationConfig = [
                'temperature' => $temperature,
                'maxOutputTokens' => $maxTokens,
            ];
            $request->setGenerationConfig($generationConfig);

            // Set the endpoint
            $endpoint = "projects/{$projectId}/locations/{$location}/publishers/google/models/{$model}";

            // Generate content
            $response = $this->getClient()->generateContent($request, ['endpoint' => $endpoint]);

            // Process the response
            $result = $this->processResponse($response);

            return $this->cacheResult($cacheKey, $result);
        } catch (ApiException $e) {
            $this->handleApiError($e);
        }
    }

    /**
     * Map roles from standard format to Google's format.
     */
    protected function mapRole(string $role): string
    {
        return match ($role) {
            'user' => 'user',
            'assistant' => 'model',
            'system' => 'system',
            default => 'user',
        };
    }

    /**
     * Process the API response.
     */
    protected function processResponse(GenerateContentResponse $response): array
    {
        $result = [];
        $result['candidates'] = [];

        foreach ($response->getCandidates() as $candidate) {
            $candidateData = [];
            $content = $candidate->getContent();

            $candidateData['role'] = $content->getRole();
            $candidateData['parts'] = [];

            foreach ($content->getParts() as $part) {
                $candidateData['parts'][] = [
                    'text' => $part->getText(),
                ];
            }

            $result['candidates'][] = $candidateData;
        }

        return $result;
    }
}
