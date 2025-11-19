<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('pricing_configs')->insert([
            'key' => 'workflow_download',
            'name' => 'Workflow Download',
            'description' => 'Cost to download a workflow in n8n format',
            'credit_cost' => 10.00,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('pricing_configs')->where('key', 'workflow_download')->delete();
    }
};
