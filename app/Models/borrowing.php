<?php

namespace App\Models;

use App\Observers\BorrowingObserver;
use Illuminate\Database\Eloquent\Model;

class Borrowing extends Model
{
    protected $table = 'borrowings';

    protected $fillable = [
        'user_id',
        'book_id',
        'quantity',
        'condition',
        'borrowed_at',
        'due_at',
        'notes',
        'status',
    ];

    protected $casts = [
    'borrowed_at' => 'datetime',
    'due_at' => 'datetime',
];

    protected static function boot(): void
    {
        parent::boot();
        static::observe(BorrowingObserver::class);
    }

    public function borrowingsUser()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function borrowingsBook()
    {
        return $this->belongsTo(Book::class, 'book_id');
    }

    public function return()
    {
        return $this->hasOne(ReturnBook::class, 'borrowing_id');
    }

}
