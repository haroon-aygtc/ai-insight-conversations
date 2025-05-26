<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        //
    ];
    
    /**
     * Increase the CSRF token lifetime to match the session lifetime
     * This helps prevent token mismatches when handling large form submissions
     *
     * @var int
     */
    protected $tokensLifetime = 240; // minutes, matching SESSION_LIFETIME
}
