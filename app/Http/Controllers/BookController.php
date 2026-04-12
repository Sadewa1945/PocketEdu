<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\borrowing;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index(){
        $books = Book::with('stock')->get();

        return response()->json([
            'message' => true,
            'data' => $books
        ], 200);
    }

    public function borrowingsCount(){
        $count = borrowing::count();

        return response()->json([
            'message' => true,
            'data' => $count
        ], 200);
    }
}
