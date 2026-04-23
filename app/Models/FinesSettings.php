<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinesSettings extends Model
{
    protected $table = 'fines_settings';

    protected $fillable = [
        'key',
        'fine_name',
        'fine_categories',
        'value',
        'type'
    ];

    public static function getValue($key, $default = 0)
    {
        $setting = self::where('key', $key)->first();
        return $setting ? (int) $setting->value : $default;
    }

    public function getFine()
    {
        return $this->hasMany(Fine::class);
    }

}
