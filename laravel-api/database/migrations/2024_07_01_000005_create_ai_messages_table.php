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
        Schema::create('ai_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ai_conversation_id')->constrained()->onDelete('cascade');
            $table->string('role'); // user, assistant, system
            $table->text('content');
            $table->json('metadata')->nullable();
            $table->integer('tokens_used')->nullable();
            $table->float('response_time')->nullable(); // in seconds
            $table->string('feedback')->nullable(); // positive, negative, neutral
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_messages');
    }
};
