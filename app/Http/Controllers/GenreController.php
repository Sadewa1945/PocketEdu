<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use Illuminate\Http\Request;

class GenreController extends Controller
{
    public function getGenre(){
        $genre = Genre::all();

        return response()->json([
            'message' => true,
            'data' => $genre
        ], 200);
    }
}
