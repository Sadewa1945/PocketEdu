<?php

namespace Database\Seeders;

use App\Models\Bookshelf;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BookshelfSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bookshelfs = [
            'bookshelf-A1',
            'bookshelf-A2',
            'bookshelf-A3',
            'bookshelf-B1',
            'bookshelf-B2',
            'bookshelf-B3',

        ];

        foreach ($bookshelfs as $bookshelf) {
            Bookshelf::create([
                'name' => $bookshelf,
            ]);
        }
    }
}