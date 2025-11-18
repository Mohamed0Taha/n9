#!/bin/bash

# Make taha.elfatih@gmail.com an admin

echo "🔐 Making taha.elfatih@gmail.com an admin..."

heroku run php artisan tinker --app=pure-inlet-35276 << 'TINKER_COMMANDS'
$user = User::where('email', 'taha.elfatih@gmail.com')->first();

if (!$user) {
    echo "❌ User not found. Please sign in with Google first!\n";
    echo "Visit: https://pure-inlet-35276-c4fd929e7b3a.herokuapp.com/\n";
} else {
    $user->is_admin = true;
    $user->save();
    echo "✅ Success! taha.elfatih@gmail.com is now an admin!\n";
    echo "📊 Current credit balance: " . $user->credit_balance . " credits\n";
    echo "🎯 Access admin panel at: /admin/pricing\n";
}

exit
TINKER_COMMANDS

echo ""
echo "✅ Done! You can now access the admin panel."
