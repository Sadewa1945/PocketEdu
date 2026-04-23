<?php

namespace App\Filament\Widgets;

use App\Models\Borrowing; 
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class TrendPeminjamanChart extends ChartWidget
{
    protected ?string $heading = 'Monthly Borrowings';

     protected static ?int $sort = 2;

    protected function getData(): array
    {
        $data = [];
        $labels = [];

        for ($month = 1; $month <= 12; $month++) {
            $count = Borrowing::whereYear('created_at', now()->year)
                ->whereMonth('created_at', $month)
                ->count();

            $data[] = $count;
            
            $labels[] = Carbon::create()->month($month)->translatedFormat('F');
        }

        return [
            'datasets' => [
                [
                    'label' => 'Buku Dipinjam',
                    'data' => $data,
                    'borderColor' => '#3b82f6',
                    'fill' => 'start',
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
