<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Book extends Model
{
    protected $table = 'books';

    protected $appends = ['total_stock', 'available_stock'];

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

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function stock()
    {
        return $this->hasMany(Stock::class, 'book_id');
    }

    public function getTotalStockAttribute()
    {
        return $this->stock->sum('total_stock') ?? 0;
    }

    public function getAvailableStockAttribute()
    {
        return $this->stock->sum('available_stock') ?? 0;
    }

    public function borrowings()
    {
        return $this->hasMany(Borrowing::class, 'book_id');
    }
}