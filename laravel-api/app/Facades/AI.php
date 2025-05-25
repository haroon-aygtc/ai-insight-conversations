<?php

declare(strict_types=1);

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static \App\Services\AI\AIManager provider(string $provider = null)
 * @method static \App\Services\AI\AIManager model(string $model = null)
 * @method static string|array generateText(string $prompt, array $options = [])
 * @method static string|array generateImage(string $prompt, array $options = [])
 * @method static string|array generateEmbeddings(string $text, array $options = [])
 * @method static string|array generateCompletion(string $prompt, array $options = [])
 * @method static string|array generateChat(array $messages, array $options = [])
 *
 * @see \App\Services\AI\AIManager
 */
class AI extends Facade
{
    /**
     * Get the registered name of the component.
     */
    protected static function getFacadeAccessor(): string
    {
        return 'ai';
    }
}
