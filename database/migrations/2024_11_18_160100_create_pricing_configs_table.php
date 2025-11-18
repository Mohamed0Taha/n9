<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pricing_configs', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique(); // e.g., 'save_workflow', 'ai_generation', 'execution'
            $table->string('name'); // Display name
            $table->text('description')->nullable();
            $table->decimal('credit_cost', 10, 2); // Cost in credits
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Insert default pricing
        DB::table('pricing_configs')->insert([
            [
                'key' => 'save_workflow',
                'name' => 'Save Workflow',
                'description' => 'Cost to save a workflow permanently',
                'credit_cost' => 10.00,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'ai_generation',
                'name' => 'AI Workflow Generation',
                'description' => 'Cost to generate a workflow with AI',
                'credit_cost' => 50.00,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'workflow_execution',
                'name' => 'Workflow Execution',
                'description' => 'Cost per workflow execution',
                'credit_cost' => 1.00,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'schedule_workflow',
                'name' => 'Schedule Workflow',
                'description' => 'Cost to enable workflow scheduling',
                'credit_cost' => 20.00,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'add_credential',
                'name' => 'Add Credential',
                'description' => 'Cost to add API credentials',
                'credit_cost' => 5.00,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('pricing_configs');
    }
};
