<?php

namespace App\Models;

use App\Observers\BorrowingObserver;
use Illuminate\Database\Eloquent\Model;

class borrowing extends Model
{
    protected $table = 'borrowings';

    protected $fillable = [
        'user_id',
        'book_id',
        'quantity',
        'condition',
        'borrowed_at',
        'returned_at',
        'due_at',
        'status',
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

}
