@echo off
echo Restarting Laravel development server...

cd laravel-api

echo Clearing Laravel caches...
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo Caching configurations...
php artisan config:cache

echo Starting Laravel development server...
php artisan serve --host=0.0.0.0 --port=8000

pause
