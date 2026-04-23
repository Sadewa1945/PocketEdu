<?php

namespace Database\Seeders;

use App\Models\Genre;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class GenreSeeder extends Seeder
{
    public function run(): void
    {
        $genres = [
            'Fiction', 'Mystery', 'Romance', 'Fantasy', 
            'Biography', 'Education', 'Thriller', 'Horror','slice of life'
        ];

        foreach ($genres as $genre) {
            Genre::firstOrCreate(
                ['name' => $genre],
                ['slug' => Str::slug($genre)]
            );
        }
    }
}