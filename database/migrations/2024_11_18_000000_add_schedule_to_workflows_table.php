<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('workflows', function (Blueprint $table) {
            $table->boolean('is_scheduled')->default(false)->after('status');
            $table->string('schedule_interval')->nullable()->after('is_scheduled');
            $table->string('schedule_timezone')->default('UTC')->after('schedule_interval');
            $table->timestamp('last_scheduled_run')->nullable()->after('schedule_timezone');
            $table->timestamp('next_scheduled_run')->nullable()->after('last_scheduled_run');
        });
    }

    public function down(): void
    {
        Schema::table('workflows', function (Blueprint $table) {
            $table->dropColumn([
                'is_scheduled',
                'schedule_interval',
                'schedule_timezone',
                'last_scheduled_run',
                'next_scheduled_run'
            ]);
        });
    }
};
