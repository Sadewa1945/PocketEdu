<?php

namespace Database\Seeders;

use App\Models\Publisher;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PublisherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $publishers = [
            'Haru',
            'C-Klik Media',
            'Garasi',
            'Penerbit Andi',
        ];

        foreach ($publishers as $publisher) {
            Publisher::create([
                'publisher_name' => $publisher,
            ]);
        }
    }
}
