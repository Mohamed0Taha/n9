#!/bin/bash

# Kill any existing queue workers
pkill -f "queue:work"

# Start queue worker with proper timeout settings
# --timeout=300 allows jobs to run for 5 minutes
# --tries=3 allows 3 attempts before marking as failed
# --sleep=3 waits 3 seconds between job processing
php artisan queue:work --timeout=300 --tries=3 --sleep=3
