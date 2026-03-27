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
        Schema::create('application_gmail_notification', function (Blueprint $table) {
            $table->foreignId('application_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('gmail_notification_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->primary(['application_id', 'gmail_notification_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_gmail_notification');
    }
};
