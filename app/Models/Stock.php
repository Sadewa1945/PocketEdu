<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $table = 'book_stock';

    protected $fillable = [
        'book_id',
        'total_stock',
        'available_stock',
        'status',
    ];

    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    protected static function booted()
    {
        static::saving(function ($stock) {
            $stock->status = $stock->available_stock <= 0 ? 'out_of_stock' : 'available';
        });
    }

    public function getStatusLabelAttribute()
    {
        return $this->status === 'out_of_stock' ? 'Tidak tersedia' : 'Tersedia';
    }
}