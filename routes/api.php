<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BorrowController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReturnController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:6,1');
Route::post('/register', [AuthController::class, 'register']);

Route::get('/books', [BookController::class, 'index']);
Route::get('/borrowings/count', [BorrowController::class, 'borrowingsCount']);
Route::get('/borrowings/overdue/count', [BorrowController::class, 'overdueCount']);
Route::get('/categories', [CategoryController::class, 'category']);

Route::post('/payment/notification', [PaymentController::class, 'webhook']);

Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    Route::get('/borrowing/{id}/returns/setup', [ReturnController::class, 'show'])->where('id', '[0-9]+');
    Route::post('/borrowing/{id}/returns', [ReturnController::class, 'storeReturn'])->where('id', '[0-9]+');

    Route::get('/borrowing', [BorrowController::class, 'index']);
    Route::post('/borrow', [BorrowController::class, 'borrow']);
    Route::get('/borrowing/{id}', [BorrowController::class, 'show'])->where('id', '[0-9]+');

    Route::get('/return', [ReturnController::class, 'index']);

    Route::get('/books/{id}', [BookController::class, 'show']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('user/profile', [UserController::class, 'profile']);
    Route::post('user/profile', [UserController::class, 'updateProfile']);

    Route::post('/payment/token/{returnId}', [PaymentController::class, 'getSnapToken']);
    
});