<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BukuMasuk extends Model
{
    protected $table = 'buku_masuks';

    protected $fillable = [
        'book_id',
        'book_price',
        'stock'
    ];

    public function books()
    {
        return $this->belongsTo(Book::class, 'book_id');
    }
}
