<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Setting::create(['key' => 'late_fine', 'label' => 'Denda Keterlambatan (Per Hari)', 'value' => 2000]);
        Setting::create(['key' => 'damage_fine', 'label' => 'Denda Buku Rusak', 'value' => 50000]);
        Setting::create(['key' => 'lost_fine', 'label' => 'Denda Buku Hilang', 'value' => 100000]);
    }
}
