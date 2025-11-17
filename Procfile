web: php artisan config:cache && php artisan route:cache && php artisan view:cache && vendor/bin/heroku-php-apache2 public/
worker: php artisan queue:work --timeout=300 --tries=3 --sleep=3 --verbose
