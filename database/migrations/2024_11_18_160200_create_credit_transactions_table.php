<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('credit_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['purchase', 'spend', 'refund', 'bonus', 'admin_adjustment']);
            $table->decimal('amount', 10, 2); // Positive for credit, negative for debit
            $table->decimal('balance_after', 10, 2); // Balance after transaction
            $table->string('description');
            $table->string('reference_type')->nullable(); // e.g., 'workflow', 'ai_generation'
            $table->unsignedBigInteger('reference_id')->nullable(); // ID of related item
            $table->json('metadata')->nullable(); // Additional data
            $table->timestamps();

            $table->index('user_id');
            $table->index(['reference_type', 'reference_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('credit_transactions');
    }
};
