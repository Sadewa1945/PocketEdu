<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/admin/login');
});

//Get Login Page
Route::get('/login', function(){
    return Inertia::render('Auth/Login');
})->name('login')->middleware('guest');

