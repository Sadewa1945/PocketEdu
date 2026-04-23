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
        Schema::create('fines_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('fine_name');
            $table->integer('value');
            $table->enum('fine_categories', ['late', 'damaged_or_lost']);
            $table->enum('type', ['fixed', 'percentage'])->default('fixed');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fines_settings');
    }
};
