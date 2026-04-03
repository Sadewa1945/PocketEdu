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

Route::get('/dashboard', function(){
    return Inertia::render('Dashboard');
})->name('dashboard')->middleware('auth');

Route::get('/books', function(){
    return Inertia::render('BooksOverview');
})->name('books')->middleware('auth');