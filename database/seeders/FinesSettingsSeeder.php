<?php

namespace Database\Seeders;

use App\Models\FinesSettings;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FinesSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        FinesSettings::create(['key' => 'late_fine', 'fine_categories' => 'late', 'fine_name' => 'Denda Keterlambatan (Per Hari)', 'value' => 2000]);
        FinesSettings::create(['key' => 'damage_fine', 'fine_categories' => 'damaged_or_lost', 'fine_name' => 'Denda Buku Rusak', 'value' => 50000]);
        FinesSettings::create(['key' => 'lost_fine', 'fine_categories' => 'damaged_or_lost', 'fine_name' => 'Denda Buku Hilang', 'value' => 100000]);
    }
}
