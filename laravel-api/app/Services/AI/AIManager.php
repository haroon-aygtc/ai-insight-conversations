<?php

declare(strict_types=1);

namespace App\Services\AI;

use App\Services\AI\Exceptions\AIProviderException;
use App\Services\AI\Contracts\AIProviderInterface;
use Illuminate\Contracts\Container\Container;
use Illuminate\Support\Manager;

class AIManager extends Manager
{
    /**
     * The active provider instances.
     *
     * @var array<string, AIProviderInterface>
     */
    protected array $providers = [];

    /**
     * The current provider name.
     */
    protected ?string $currentProvider = null;

    /**
     * The current model name.
     */
    protected ?string $currentModel = null;

    /**
     * Create a new manager instance.
     */
    public function __construct(Container $container)
    {
        parent::__construct($container);
        $this->currentProvider = $this->getDefaultDriver();
    }

    /**
     * Get the default AI driver name.
     */
    public function getDefaultDriver(): string
    {
        return $this->container['config']['ai.default'];
    }

    /**
     * Get a driver instance.
     *
     * @param string|null $driver
     * @return AIProviderInterface
     *
     * @throws \InvalidArgumentException
     */
    public function driver($driver = null): AIProviderInterface
    {
        $driver = $driver ?: $this->getDefaultDriver();

        $this->currentProvider = $driver;

        if (!isset($this->providers[$driver])) {
            $this->providers[$driver] = $this->createDriver($driver);
        }

        return $this->providers[$driver];
    }

    /**
     * Set the active provider.
     */
    public function provider(?string $provider = null): self
    {
        if ($provider) {
            $this->driver($provider);
        }

        return $this;
    }

    /**
     * Set the active model.
     */
    public function model(?string $model = null): self
    {
        if ($model) {
            $this->currentModel = $model;
        }

        return $this;
    }

    /**
     * Generate text with the specified provider.
     */
    public function generateText(string $prompt, array $options = []): string|array
    {
        $provider = $this->driver($this->currentProvider);
        $model = $this->currentModel ?? $this->getDefaultModelForCurrentProvider();

        return $provider->generateText($prompt, $model, $options);
    }

    /**
     * Generate image with the specified provider.
     */
    public function generateImage(string $prompt, array $options = []): string|array
    {
        $provider = $this->driver($this->currentProvider);
        $model = $this->currentModel ?? $this->getDefaultModelForCurrentProvider();

        return $provider->generateImage($prompt, $model, $options);
    }

    /**
     * Generate embeddings with the specified provider.
     */
    public function generateEmbeddings(string $text, array $options = []): string|array
    {
        $provider = $this->driver($this->currentProvider);
        $model = $this->currentModel ?? $this->getDefaultModelForCurrentProvider();

        return $provider->generateEmbeddings($text, $model, $options);
    }

    /**
     * Generate completion with the specified provider.
     */
    public function generateCompletion(string $prompt, array $options = []): string|array
    {
        $provider = $this->driver($this->currentProvider);
        $model = $this->currentModel ?? $this->getDefaultModelForCurrentProvider();

        return $provider->generateCompletion($prompt, $model, $options);
    }

    /**
     * Generate chat with the specified provider.
     */
    public function generateChat(array $messages, array $options = []): string|array
    {
        $provider = $this->driver($this->currentProvider);
        $model = $this->currentModel ?? $this->getDefaultModelForCurrentProvider();

        return $provider->generateChat($messages, $model, $options);
    }

    /**
     * Create a new driver instance.
     *
     * @param string $driver
     * @return AIProviderInterface
     *
     * @throws \InvalidArgumentException
     */
    protected function createDriver($driver): AIProviderInterface
    {
        // First we'll check if a custom driver creator exists for the given driver
        if (isset($this->customCreators[$driver])) {
            return $this->callCustomCreator($driver);
        }

        // If there is no custom creator, we'll check if a method exists for
        // creating the driver, if it does, we'll call it and return the result
        $method = 'create' . ucfirst($driver) . 'Driver';

        if (method_exists($this, $method)) {
            return $this->$method();
        }

        throw new AIProviderException("Driver [$driver] not supported.");
    }

    /**
     * Get the default model for the current provider.
     */
    protected function getDefaultModelForCurrentProvider(): string
    {
        return $this->container['config']["ai.providers.{$this->currentProvider}.default_model"];
    }

    /**
     * Create an instance of the OpenAI driver.
     */
    protected function createOpenaiDriver(): AIProviderInterface
    {
        $config = $this->container['config']['ai.providers.openai'];

        return $this->container->make(Providers\OpenAIProvider::class, [
            'config' => $config,
        ]);
    }

    /**
     * Create an instance of the Anthropic driver.
     */
    protected function createAnthropicDriver(): AIProviderInterface
    {
        $config = $this->container['config']['ai.providers.anthropic'];

        return $this->container->make(Providers\AnthropicProvider::class, [
            'config' => $config,
        ]);
    }

    /**
     * Create an instance of the Google driver.
     */
    protected function createGoogleDriver(): AIProviderInterface
    {
        $config = $this->container['config']['ai.providers.google'];

        return $this->container->make(Providers\GoogleProvider::class, [
            'config' => $config,
        ]);
    }

    /**
     * Create an instance of the HuggingFace driver.
     */
    protected function createHuggingfaceDriver(): AIProviderInterface
    {
        $config = $this->container['config']['ai.providers.huggingface'];

        return $this->container->make(Providers\HuggingFaceProvider::class, [
            'config' => $config,
        ]);
    }

    /**
     * Create an instance of the Mistral driver.
     */
    protected function createMistralDriver(): AIProviderInterface
    {
        $config = $this->container['config']['ai.providers.mistral'];

        return $this->container->make(Providers\MistralProvider::class, [
            'config' => $config,
        ]);
    }

    /**
     * Create an instance of the OpenRouter driver.
     */
    protected function createOpenrouterDriver(): AIProviderInterface
    {
        $config = $this->container['config']['ai.providers.openrouter'];

        return $this->container->make(Providers\OpenRouterProvider::class, [
            'config' => $config,
        ]);
    }

    /**
     * Create an instance of the DeepSeek driver.
     */
    protected function createDeepseekDriver(): AIProviderInterface
    {
        $config = $this->container['config']['ai.providers.deepseek'];

        return $this->container->make(Providers\DeepSeekProvider::class, [
            'config' => $config,
        ]);
    }

    /**
     * Create an instance of the Grok driver.
     */
    protected function createGrokDriver(): AIProviderInterface
    {
        $config = $this->container['config']['ai.providers.grok'];

        return $this->container->make(Providers\GrokProvider::class, [
            'config' => $config,
        ]);
    }
}
