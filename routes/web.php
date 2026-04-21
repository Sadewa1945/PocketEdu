<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Semua rute web akan diarahkan ke view 'app'. 
| React Router di app.jsx yang akan menentukan komponen mana yang muncul.
|
*/

Route::get('/{any}', function () {
    return view('app'); 
})->where('any', '.*');