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
        Schema::create('widgets', function (Blueprint $table) {
            $table->id();
            $table->string('widget_id')->unique(); // Public widget identifier
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('appearance_config'); // Colors, fonts, sizes, etc.
            $table->json('behavior_config'); // Auto-open, position, animations, etc.
            $table->json('content_config'); // Messages, bot name, placeholders, etc.
            $table->json('embedding_config'); // Allowed domains, security settings
            $table->boolean('is_active')->default(true);
            $table->boolean('is_published')->default(false);
            $table->string('status')->default('draft'); // draft, published, archived
            $table->timestamp('published_at')->nullable();
            $table->integer('views_count')->default(0);
            $table->integer('interactions_count')->default(0);
            $table->timestamps();

            $table->index(['user_id', 'is_active']);
            $table->index(['widget_id', 'is_published']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('widgets');
    }
};
