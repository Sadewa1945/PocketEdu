<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fine extends Model
{
    protected $fillable = [
        'return_book_id',
        'user_id',
        'fine_type',
        'amount',
        'status',
        'paid_at'
    ];

    public function returnBook()
    {
        return $this->belongsTo(ReturnBook::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function fineSetting()
    {
        return $this->belongsTo(FinesSettings::class, 'fine_type_id');
    }
}