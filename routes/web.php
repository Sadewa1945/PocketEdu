<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/admin/login');
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/books', function(){
        return Inertia::render('BooksOverview');
    })->name('books');

    Route::get('/books/{id}', function(){
        return Inertia::render('BooksOverview');
    })->name('books.detail');

    Route::get('/user/profile', function(){
        return Inertia::render('Profile');
    })->name('profile');

    Route::get('/categories', function(){
        return Inertia::render('Categories');
    })->name('categories');
});

//Get Login Page
Route::get('/login', function(){
    return Inertia::render('Auth/Login');
})->name('login');

Route::get('/register', function(){
    return Inertia::render('Auth/Register');
})->name('register');







