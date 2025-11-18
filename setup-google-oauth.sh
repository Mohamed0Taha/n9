#!/bin/bash

# Google OAuth Setup Script for Heroku
# Replace the placeholder values with your actual credentials from Google Cloud Console

echo "🔐 Setting up Google OAuth on Heroku..."

# Replace these with your actual values from Google Cloud Console
GOOGLE_CLIENT_ID="YOUR_CLIENT_ID_HERE.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="YOUR_CLIENT_SECRET_HERE"
GOOGLE_REDIRECT_URI="https://pure-inlet-35276-c4fd929e7b3a.herokuapp.com/auth/google/callback"

# Set the config vars on Heroku
heroku config:set GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID" --app=pure-inlet-35276
heroku config:set GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET" --app=pure-inlet-35276
heroku config:set GOOGLE_REDIRECT_URI="$GOOGLE_REDIRECT_URI" --app=pure-inlet-35276

echo "✅ Google OAuth credentials set on Heroku!"
echo ""
echo "Next steps:"
echo "1. Run migrations: heroku run php artisan migrate --app=pure-inlet-35276"
echo "2. Test login at: https://pure-inlet-35276-c4fd929e7b3a.herokuapp.com/"
