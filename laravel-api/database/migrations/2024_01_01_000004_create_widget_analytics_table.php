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
        Schema::create('widget_analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('widget_id')->constrained()->onDelete('cascade');
            $table->string('event_type'); // view, interaction, message_sent, etc.
            $table->ipAddress('ip_address');
            $table->text('user_agent');
            $table->string('referrer_url')->nullable();
            $table->string('page_url')->nullable();
            $table->json('event_data')->nullable(); // Additional event-specific data
            $table->string('session_id')->nullable();
            $table->string('visitor_id')->nullable(); // For tracking unique visitors
            $table->timestamps();

            $table->index(['widget_id', 'event_type', 'created_at']);
            $table->index(['visitor_id', 'session_id']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('widget_analytics');
    }
};
