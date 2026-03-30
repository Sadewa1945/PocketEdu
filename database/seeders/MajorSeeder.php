<?php

namespace Database\Seeders;

use App\Models\Major;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MajorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Major::insert([
            ['name' => 'Rekayasa Perangkat Lunak', 'code' => 'RPL'],
            ['name' => 'Broadcasting', 'code' => 'BRF'],
            ['name' => 'Multimedia', 'code' => 'MM'],
            ['name' => 'Teknik Jaringan Komputer', 'code' => 'TKJ'],
            ['name' => 'Teknik Elektronika', 'code' => 'TE'],
        ]);
    }
}
