<?php

declare(strict_types=1);

namespace App\Services\AI\Contracts;

interface AIProviderInterface
{
    /**
     * Generate text with the specified model.
     */
    public function generateText(string $prompt, string $model, array $options = []): string|array;

    /**
     * Generate image with the specified model.
     */
    public function generateImage(string $prompt, string $model, array $options = []): string|array;

    /**
     * Generate embeddings with the specified model.
     */
    public function generateEmbeddings(string $text, string $model, array $options = []): string|array;

    /**
     * Generate completion with the specified model.
     */
    public function generateCompletion(string $prompt, string $model, array $options = []): string|array;

    /**
     * Generate chat with the specified model.
     */
    public function generateChat(array $messages, string $model, array $options = []): string|array;
}
