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
        FinesSettings::create(['key' => 'late_fine', 'label' => 'Denda Keterlambatan (Per Hari)', 'value' => 2000]);
        FinesSettings::create(['key' => 'damage_fine', 'label' => 'Denda Buku Rusak', 'value' => 50000]);
        FinesSettings::create(['key' => 'lost_fine', 'label' => 'Denda Buku Hilang', 'value' => 100000]);
    }
}
