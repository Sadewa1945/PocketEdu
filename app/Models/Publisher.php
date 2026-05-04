<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Publisher extends Model
{
    protected $table = 'publishers';
    
    protected $fillable = ['publisher_name'];

    public function publisherBooks()
    {
        return $this->hasMany(Book::class, 'publisher_id');
    }
}
