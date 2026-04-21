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

    public function borrowingsUser()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function borrowingsBook()
    {
        return $this->belongsTo(Book::class, 'book_id');
    }

    public function returnBook()
    {
        return $this->hasOne(ReturnBook::class, 'borrowing_id')->latest();
    }

    public function user() 
    {
        return $this->belongsTo(User::class);
    }

}
