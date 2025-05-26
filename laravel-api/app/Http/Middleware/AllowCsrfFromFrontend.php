<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AllowCsrfFromFrontend
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): Response
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
