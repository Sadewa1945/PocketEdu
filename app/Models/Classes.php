<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Classes extends Model
{
    protected $table = 'classes';

    protected $fillable = [
        'grade',
        'major_id',
        'class_section',
    ];

    /**
     * Get all students for this class.
     */
    public function major()
    {
        return $this->belongsTo(Major::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
