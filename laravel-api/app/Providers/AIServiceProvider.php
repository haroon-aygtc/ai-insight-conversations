<?php

declare(strict_types=1);

namespace App\Providers;

use App\Services\AI\AIManager;
use Illuminate\Support\ServiceProvider;

class AIServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton('ai', function ($app) {
            return new AIManager($app);
        });

        $this->mergeConfigFrom(
            __DIR__.'/../../config/ai.php', 'ai'
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->publishes([
            __DIR__.'/../../config/ai.php' => config_path('ai.php'),
        ], 'ai-config');
    }
}
