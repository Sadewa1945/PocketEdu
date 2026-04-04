<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function category(){
        $categories = Category::all();

        return response()->json([
            'message' => true,
            'data' => $categories
        ], 200);
    }
}
