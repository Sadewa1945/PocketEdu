<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Book extends Model
{
    protected $table = 'books';

    protected $fillable = [
        'title',
        'author',
        'isbn',
        'published_date',
        'publisher',
        'description',
        'cover_image',
        'category_id',
    ];

    /**
     * Get the category that the book belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Get all stocks for this book.
     */
    public function stock()
    {
        return $this->hasMany(Stock::class, 'book_id');
    }

    public function getTotalStockAttribute()
    {
        return $this->stocks->sum('quantity') ?? 0;
    }

    public function getAvailableStockAttribute()
    {
        return $this->stocks->where('status', 'Tersedia')->sum('quantity') ?? 0;
    }

    public function borrowings()
    {
        return $this->hasMany(borrowing::class, 'book_id');
    }

    
}
