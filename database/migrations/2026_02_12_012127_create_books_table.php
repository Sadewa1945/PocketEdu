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
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bookshelf_id')->constrained('bookshelves')->restrictOnDelete();
            $table->string('title');
            $table->foreignId('authors_id')->constrained('authors')->restrictOnDelete();
            $table->string('isbn')->unique();
            $table->date('published_date');
            $table->decimal('book_price', 12,2);
            $table->foreignId('publisher_id')->constrained('publishers')->restrictOnDelete();
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable()->default('pocketedu.png');
            $table->integer('stock')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
