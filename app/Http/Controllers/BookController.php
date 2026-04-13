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

    public function show($id){
        $book = Book::with('stock', 'category')->find($id);

        if(!$book){
            return response()->json([
                'message' => false,
                'data' => null
            ], 404);
        }

        return response()->json([
            'message' => true,
            'data' => $book
        ], 200);
    }
}
