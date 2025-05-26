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
        Schema::create('user_sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->ipAddress('ip_address');
            $table->text('user_agent');
            $table->longText('payload');
            $table->integer('last_activity');
            $table->timestamp('expires_at')->nullable();
            $table->string('location')->nullable();
            $table->boolean('remember_token')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'last_activity']);
            $table->index('last_activity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_sessions');
    }
};
