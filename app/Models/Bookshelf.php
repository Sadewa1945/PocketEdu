<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bookshelf extends Model
{
    protected $table = 'bookshelves';

    protected $fillable = [
        'name',
    ];

    /**
     * Get all books in this bookshelf.
     */
    public function books(): HasMany
    {
        return $this->hasMany(Book::class, 'bookshelf_id');
    }
}
