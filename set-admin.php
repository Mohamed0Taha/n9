<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = App\Models\User::where('email', 'taha.elfatih@gmail.com')->first();

if (!$user) {
    echo "❌ User not found. Please sign in with Google first!\n";
    echo "Visit: https://pure-inlet-35276-c4fd929e7b3a.herokuapp.com/\n";
    exit(1);
}

$user->is_admin = true;
$user->save();

echo "✅ SUCCESS! taha.elfatih@gmail.com is now an admin!\n";
echo "📊 Credit Balance: {$user->credit_balance} credits\n";
echo "🎯 Access admin panel at: /admin/pricing\n";
