<?php

namespace Database\Seeders;

use App\Models\Author;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AuthorsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $authors = [
            'Shigeaki Kato',
            'Makoto Shinkai',
            'Mori Hiroshi,',
            'Akiyoshi Rikako',
            'Anom Whani Wicaksono',
            'Salman Alfarizi',
            'Cekmas Cekdin',
        ];

        foreach ($authors as $author) {
            Author::create([
                'author_name' => $author,
            ]);
        }
    }
}
