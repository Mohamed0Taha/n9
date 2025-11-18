<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Console\Scheduling\Schedule;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Trust Heroku proxies for proper HTTPS detection
        $middleware->trustProxies(at: '*');
        
        // Track guest usage and enforce 1-hour session limit
        $middleware->web(append: [
            \App\Http\Middleware\TrackGuestUsage::class,
        ]);
        
        // Register middleware alias for route-specific usage
        $middleware->alias([
            'require.auth.save' => \App\Http\Middleware\RequireAuthForSave::class,
            'check.credits' => \App\Http\Middleware\CheckCredits::class,
        ]);
    })
    ->withSchedule(function (Schedule $schedule): void {
        // Run scheduled workflows check every minute
        $schedule->command('workflows:run-scheduled')
            ->everyMinute()
            ->withoutOverlapping()
            ->runInBackground();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
