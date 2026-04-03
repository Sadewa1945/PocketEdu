<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::get('/books', [BookController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    Route::post('/logout', [AuthController::class, 'logout']);
    
});
