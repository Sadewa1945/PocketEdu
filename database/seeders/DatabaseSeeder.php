<?php

namespace Database\Seeders;

use App\Models\Genre;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            GenreSeeder::class,
            AuthorsSeeder::class,
            BookshelfSeeder::class,
            BookSeeder::class,
            FinesSettingsSeeder::class,
            GenreSeeder::class
        ]);
    }
}
