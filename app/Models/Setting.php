<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $table = 'settings';

    protected $fillable = [
        'key',
        'label',
        'value'
    ];

    public static function getValue($key, $default = 0)
    {
        $setting = self::where('key', $key)->first();
        return $setting ? (int) $setting->value : $default;
    }
}
