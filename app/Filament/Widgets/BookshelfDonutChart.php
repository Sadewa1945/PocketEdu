<?php

namespace App\Filament\Widgets;

use App\Models\Bookshelf;
use Filament\Widgets\ChartWidget;

class BookshelfDonutChart extends ChartWidget
{
    protected ?string $heading = 'Number of Books per Shelf';

    protected static ?int $sort = 3;

    protected function getData(): array
    {
        $bookshelves = Bookshelf::withCount('books')->get();

        return [
            'datasets' => [
                [
                    'label' => 'Total Buku',
                    'data' => $bookshelves->pluck('books_count')->toArray(),
                    'backgroundColor' => [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40'
                    ],
                ],
            ],
            'labels' => $bookshelves->pluck('name')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'doughnut'; 
    }
}