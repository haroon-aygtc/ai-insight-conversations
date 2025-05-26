# Additional CSRF Fix Options

If the changes in the `.env` file don't completely resolve your CSRF token mismatch errors, you may need to make additional modifications:

## Option 1: Update VerifyCsrfToken Middleware

Edit the `laravel-api/app/Http/Middleware/VerifyCsrfToken.php` file:

```php
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
        // Temporarily exclude problematic routes during development
        'api/auth/update-activity',
        // You can add other problematic routes here
    ];
}
```

## Option 2: Debug Cookie Handling

Add a debug route to check if cookies are being properly set:

1. Create a new route in `laravel-api/routes/web.php`:

```php
Route::get('/debug/cookies', function () {
    return response()->json([
        'cookies' => request()->cookies->all(),
        'has_xsrf' => request()->cookies->has('XSRF-TOKEN'),
        'session_config' => [
            'domain' => config('session.domain'),
            'secure' => config('session.secure'),
            'same_site' => config('session.same_site'),
        ],
        'sanctum_domains' => config('sanctum.stateful'),
    ]);
});
```

2. Visit this route in your browser to check if cookies are properly configured.

## Option 3: Force XSRF Token in Every Response

Add middleware to your Laravel application to ensure the XSRF token is refreshed on every response:

1. Create a new middleware `app/Http/Middleware/AddXsrfCookie.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

class AddXsrfCookie
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        
        // Force regenerate XSRF-TOKEN cookie
        $response->headers->setCookie(
            Cookie::make('XSRF-TOKEN', csrf_token(), 120, '/', 
                          config('session.domain'), 
                          config('session.secure'), 
                          false, // httpOnly must be false
                          false, // raw
                          config('session.same_site'))
        );
        
        return $response;
    }
}
```

2. Register this middleware in `app/Http/Kernel.php` in the `web` middleware group.

## Important Note

For development purposes only, you may temporarily disable CSRF protection by adding a global middleware in `app/Http/Kernel.php`:

```php
protected $middleware = [
    // \App\Http\Middleware\TrustHosts::class,
    \App\Http\Middleware\TrustProxies::class,
    \Illuminate\Http\Middleware\HandleCors::class,
    \App\Http\Middleware\PreventRequestsDuringMaintenance::class,
    \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
    \App\Http\Middleware\TrimStrings::class,
    \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
    
    // TEMPORARY for development only - REMOVE IN PRODUCTION
    \App\Http\Middleware\AllowCsrfFromFrontend::class,
];
```

And create `app/Http/Middleware/AllowCsrfFromFrontend.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AllowCsrfFromFrontend
{
    public function handle(Request $request, Closure $next)
    {
        // TEMPORARY development fix - REMOVE IN PRODUCTION
        if ($request->header('X-Requested-With') === 'XMLHttpRequest' &&
            in_array($request->method(), ['POST', 'PUT', 'DELETE', 'PATCH'])) {
            // Skip CSRF check for AJAX requests from the frontend during development
            $request->headers->set('X-CSRF-TOKEN', csrf_token());
        }
        
        return $next($request);
    }
}
```

**WARNING**: This last option should ONLY be used temporarily during development and MUST be removed before going to production. 