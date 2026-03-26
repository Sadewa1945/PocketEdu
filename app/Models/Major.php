<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Major extends Model
{
    protected $fillable = [
        'name',
    ];

    /**
     * Get all classes for this major.
     */
   public function classes()
{
    return $this->hasMany(Classes::class);
}
}
