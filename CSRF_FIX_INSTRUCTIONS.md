# CSRF Token Mismatch Fix Instructions

You're experiencing CSRF token mismatch errors. We've already updated the frontend code, but the Laravel backend needs some crucial environment settings to work correctly.

## Update Your Laravel .env File

Please add the following lines to your `laravel-api/.env` file:

```
FRONTEND_URL=http://localhost:5173
SESSION_SECURE_COOKIE=false
SESSION_SAME_SITE=none
```

Make sure your `SANCTUM_STATEFUL_DOMAINS` setting includes all frontend domains:

```
SANCTUM_STATEFUL_DOMAINS=localhost:8080,localhost:5173,localhost:3000,127.0.0.1:8080,127.0.0.1:5173,127.0.0.1:3000
```

## Restart Your Laravel Server

After updating the .env file, restart your Laravel server with:

```
cd laravel-api
php artisan config:clear
php artisan cache:clear
php artisan serve
```

## Clear Browser Cookies

For the changes to take effect:

1. Open your browser's developer tools (F12)
2. Go to the Application tab
3. Select "Cookies" in the Storage section
4. Delete all cookies related to your application domains
5. Refresh the page

## Verify Laravel Sanctum Configuration

The `config/sanctum.php` file should have:

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:8080,localhost:5173,localhost:3000,127.0.0.1,127.0.0.1:8080,127.0.0.1:5173,127.0.0.1:3000,127.0.0.1:8000,::1',
    Sanctum::currentApplicationUrlWithPort()
))),
```

## Testing the Fix

After making these changes:
1. Clear your browser cookies
2. Restart your Laravel backend
3. Reload your frontend application
4. Log in again 