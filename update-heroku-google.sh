#!/bin/bash

# Update this script with your NEW Google OAuth credentials
# After creating a new OAuth client in Google Console

echo "📝 Instructions:"
echo "1. Create new OAuth client in Google Console"
echo "2. Copy the new Client ID and Secret"
echo "3. Edit this file and replace the values below"
echo "4. Run: ./update-heroku-google.sh"
echo ""

# Replace these with your NEW credentials
NEW_CLIENT_ID="YOUR_NEW_CLIENT_ID.apps.googleusercontent.com"
NEW_CLIENT_SECRET="YOUR_NEW_CLIENT_SECRET"

# Uncomment these lines after updating the values above
# heroku config:set GOOGLE_CLIENT_ID="$NEW_CLIENT_ID" --app=pure-inlet-35276
# heroku config:set GOOGLE_CLIENT_SECRET="$NEW_CLIENT_SECRET" --app=pure-inlet-35276

echo "✅ After updating credentials above, uncomment the heroku commands and run this script"
