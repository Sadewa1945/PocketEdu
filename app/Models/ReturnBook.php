<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReturnBook extends Model
{
    protected $table = 'return_books';

    protected $fillable = [
        'borrowing_id',
        'returned_at',
        'late_days',
        'fine',
        'return_condition',
        'notes',
        'status'
    ];

    public function borrowing(){
        return $this->belongsTo(Borrowing::class, 'borrowing_id');
    }
}
