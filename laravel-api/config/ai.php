<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Default AI Provider
    |--------------------------------------------------------------------------
    |
    | Here you may specify which of the AI providers below you wish to use
    | as your default provider for all AI work.
    |
    */
    'default' => env('AI_PROVIDER', 'openai'),

    /*
    |--------------------------------------------------------------------------
    | AI Providers
    |--------------------------------------------------------------------------
    |
    | Here you may configure all of the AI providers for your application.
    | Each provider has its own specific configuration options.
    |
    */
    'providers' => [
        'openai' => [
            'api_key' => env('OPENAI_API_KEY'),
            'organization' => env('OPENAI_ORGANIZATION'),
            'default_model' => env('OPENAI_DEFAULT_MODEL', 'gpt-4o'),
            'models' => [
                'gpt-4o' => [
                    'max_tokens' => 4096,
                    'temperature' => 0.7,
                ],
                'gpt-4-turbo' => [
                    'max_tokens' => 4096,
                    'temperature' => 0.7,
                ],
                'gpt-4' => [
                    'max_tokens' => 2048,
                    'temperature' => 0.7,
                ],
                'gpt-3.5-turbo' => [
                    'max_tokens' => 1024,
                    'temperature' => 0.7,
                ],
            ],
        ],

        'anthropic' => [
            'api_key' => env('ANTHROPIC_API_KEY'),
            'default_model' => env('ANTHROPIC_DEFAULT_MODEL', 'claude-3-opus-20240229'),
            'models' => [
                'claude-3-opus-20240229' => [
                    'max_tokens' => 4096,
                    'temperature' => 0.7,
                ],
                'claude-3-sonnet-20240229' => [
                    'max_tokens' => 4096,
                    'temperature' => 0.7,
                ],
                'claude-3-haiku-20240307' => [
                    'max_tokens' => 2048,
                    'temperature' => 0.7,
                ],
                'claude-2.1' => [
                    'max_tokens' => 1024,
                    'temperature' => 0.7,
                ],
            ],
        ],

        'google' => [
            'api_key' => env('GOOGLE_API_KEY'),
            'credentials_file' => env('GOOGLE_APPLICATION_CREDENTIALS'),
            'project_id' => env('GOOGLE_CLOUD_PROJECT_ID'),
            'location' => env('GOOGLE_CLOUD_LOCATION', 'us-central1'),
            'default_model' => env('GOOGLE_DEFAULT_MODEL', 'gemini-1.5-pro'),
            'models' => [
                'gemini-1.5-pro' => [
                    'max_tokens' => 8192,
                    'temperature' => 0.7,
                ],
                'gemini-1.5-flash' => [
                    'max_tokens' => 4096,
                    'temperature' => 0.7,
                ],
                'gemini-1.0-pro' => [
                    'max_tokens' => 2048,
                    'temperature' => 0.7,
                ],
            ],
        ],

        'huggingface' => [
            'api_key' => env('HUGGINGFACE_API_KEY'),
            'default_model' => env('HUGGINGFACE_DEFAULT_MODEL', 'meta-llama/Llama-2-70b-chat-hf'),
            'models' => [
                'meta-llama/Llama-2-70b-chat-hf' => [
                    'max_tokens' => 2048,
                    'temperature' => 0.7,
                ],
                'mistralai/Mistral-7B-Instruct-v0.2' => [
                    'max_tokens' => 2048,
                    'temperature' => 0.7,
                ],
                'google/gemma-7b-it' => [
                    'max_tokens' => 2048,
                    'temperature' => 0.7,
                ],
            ],
        ],

        'mistral' => [
            'api_key' => env('MISTRAL_API_KEY'),
            'default_model' => env('MISTRAL_DEFAULT_MODEL', 'mistral-large-latest'),
            'models' => [
                'mistral-large-latest' => [
                    'max_tokens' => 4096,
                    'temperature' => 0.7,
                ],
                'mistral-medium-latest' => [
                    'max_tokens' => 4096,
                    'temperature' => 0.7,
                ],
                'mistral-small-latest' => [
                    'max_tokens' => 2048,
                    'temperature' => 0.7,
                ],
                'open-mixtral-8x7b' => [
                    'max_tokens' => 2048,
                    'temperature' => 0.7,
                ],
            ],
        ],

        'openrouter' => [
            'api_key' => env('OPENROUTER_API_KEY'),
            'default_model' => env('OPENROUTER_DEFAULT_MODEL', 'anthropic/claude-3-opus:2024-05-23'),
            'models' => [
                'anthropic/claude-3-opus:2024-05-23' => [
                    'max_tokens' => 4096,
                    'temperature' => 0.7,
                ],
                'openai/gpt-4o' => [
                    'max_tokens' => 4096,
                    'temperature' => 0.7,
                ],
                'mistralai/mistral-large' => [
                    'max_tokens' => 4096,
                    'temperature' => 0.7,
                ],
                'google/gemini-1.5-pro' => [
                    'max_tokens' => 8192,
                    'temperature' => 0.7,
                ],
            ],
        ],

        'deepseek' => [
            'api_key' => env('DEEPSEEK_API_KEY'),
            'default_model' => env('DEEPSEEK_DEFAULT_MODEL', 'deepseek-chat'),
            'models' => [
                'deepseek-chat' => [
                    'max_tokens' => 4096,
                    'temperature' => 0.7,
                ],
                'deepseek-coder' => [
                    'max_tokens' => 4096,
                    'temperature' => 0.7,
                ],
            ],
        ],

        'grok' => [
            'api_key' => env('GROK_API_KEY'),
            'default_model' => env('GROK_DEFAULT_MODEL', 'grok-1'),
            'models' => [
                'grok-1' => [
                    'max_tokens' => 4096,
                    'temperature' => 0.7,
                ],
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Fallback Providers
    |--------------------------------------------------------------------------
    |
    | Specify fallback providers in case the primary provider fails
    |
    */
    'fallbacks' => [
        'openai' => ['anthropic', 'google'],
        'anthropic' => ['openai', 'google'],
        'google' => ['openai', 'anthropic'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Cache Settings
    |--------------------------------------------------------------------------
    |
    | Configure AI response caching
    |
    */
    'cache' => [
        'enabled' => env('AI_CACHE_ENABLED', true),
        'ttl' => env('AI_CACHE_TTL', 3600), // Time in seconds
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Configure rate limiting for providers to avoid exceeding API quotas
    |
    */
    'rate_limits' => [
        'openai' => [
            'max_requests_per_minute' => env('OPENAI_RATE_LIMIT', 60),
        ],
        'anthropic' => [
            'max_requests_per_minute' => env('ANTHROPIC_RATE_LIMIT', 60),
        ],
        'google' => [
            'max_requests_per_minute' => env('GOOGLE_RATE_LIMIT', 60),
        ],
    ],
];
