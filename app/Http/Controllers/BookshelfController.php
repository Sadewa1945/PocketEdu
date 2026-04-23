<?php

namespace App\Http\Controllers;

use App\Models\Bookshelf;
use Illuminate\Http\Request;

class BookshelfController extends Controller
{
    public function bookshelf(){
        $bookshelf = Bookshelf::all();

        return response()->json([
            'message' => true,
            'data' => $bookshelf
        ], 200);
    }
}
