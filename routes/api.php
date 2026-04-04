<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::get('/books', [BookController::class, 'index']);
Route::get('/borrowings/count', [BookController::class, 'borrowingsCount']);
Route::get('/categories', [CategoryController::class, 'category']);

Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('user/profile', [UserController::class, 'profile']);
    Route::post('user/profile', [UserController::class, 'updateProfile']);
    
});
