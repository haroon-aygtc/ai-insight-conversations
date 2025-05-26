<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Validator;

class AIConfigController extends Controller
{
    /**
     * Get all AI configuration settings.
     */
    public function index(): JsonResponse
    {
        $config = [
            'default_provider' => Config::get('ai.default'),
            'cache' => [
                'enabled' => Config::get('ai.cache.enabled'),
                'ttl' => Config::get('ai.cache.ttl'),
            ],
            'rate_limits' => Config::get('ai.rate_limits'),
            'fallbacks' => Config::get('ai.fallbacks'),
        ];

        return response()->json(['config' => $config]);
    }

    /**
     * Update AI configuration settings.
     */
    public function update(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'default_provider' => 'string',
            'cache.enabled' => 'boolean',
            'cache.ttl' => 'integer|min:1',
            'rate_limits' => 'array',
            'fallbacks' => 'array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // In a real implementation, this would update the config file or database
        // For this demo, we'll just return the updated config

        $config = [
            'default_provider' => $request->input('default_provider', Config::get('ai.default')),
            'cache' => [
                'enabled' => $request->input('cache.enabled', Config::get('ai.cache.enabled')),
                'ttl' => $request->input('cache.ttl', Config::get('ai.cache.ttl')),
            ],
            'rate_limits' => $request->input('rate_limits', Config::get('ai.rate_limits')),
            'fallbacks' => $request->input('fallbacks', Config::get('ai.fallbacks')),
        ];

        return response()->json(['config' => $config]);
    }

    /**
     * Get fallback providers configuration.
     */
    public function getFallbacks(): JsonResponse
    {
        $fallbacks = Config::get('ai.fallbacks', []);

        return response()->json(['fallbacks' => $fallbacks]);
    }

    /**
     * Update fallback providers configuration.
     */
    public function updateFallbacks(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'fallbacks' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // In a real implementation, this would update the config file or database
        // For this demo, we'll just return the updated fallbacks

        $fallbacks = $request->input('fallbacks');

        return response()->json(['fallbacks' => $fallbacks]);
    }

    /**
     * Get cache configuration.
     */
    public function getCache(): JsonResponse
    {
        $cache = [
            'enabled' => Config::get('ai.cache.enabled'),
            'ttl' => Config::get('ai.cache.ttl'),
        ];

        return response()->json(['cache' => $cache]);
    }

    /**
     * Update cache configuration.
     */
    public function updateCache(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'enabled' => 'required|boolean',
            'ttl' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // In a real implementation, this would update the config file or database
        // For this demo, we'll just return the updated cache config

        $cache = [
            'enabled' => $request->input('enabled'),
            'ttl' => $request->input('ttl'),
        ];

        return response()->json(['cache' => $cache]);
    }

    /**
     * Get rate limits configuration.
     */
    public function getRateLimits(): JsonResponse
    {
        $rateLimits = Config::get('ai.rate_limits', []);

        return response()->json(['rate_limits' => $rateLimits]);
    }

    /**
     * Update rate limits configuration.
     */
    public function updateRateLimits(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'rate_limits' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // In a real implementation, this would update the config file or database
        // For this demo, we'll just return the updated rate limits

        $rateLimits = $request->input('rate_limits');

        return response()->json(['rate_limits' => $rateLimits]);
    }
}
