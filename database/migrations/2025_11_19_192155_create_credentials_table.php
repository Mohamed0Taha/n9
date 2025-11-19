<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('credentials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name'); // User-friendly name (e.g., "My OpenAI API Key")
            $table->string('type'); // Credential type (e.g., "openai_api", "gmail_oauth2")
            $table->text('data'); // Encrypted JSON data containing API keys, tokens, etc.
            $table->timestamps();
            
            // Index for faster lookups
            $table->index(['user_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credentials');
    }
};
