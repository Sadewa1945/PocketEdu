<?php

namespace App\Filament\Widgets;

use App\Models\Bookshelf;
use Filament\Widgets\ChartWidget;

class BooksByBookshelfChart extends ChartWidget
{
    protected ?string $heading = 'Bookshelf Proportions';

    protected static ?int $sort = 3;

    protected function getData(): array
    {
        
        $bookshelves = Bookshelf::withCount('books')->having('books_count', '>', 0)->get();

        return [
            'datasets' => [
                [
                    'label' => 'Jumlah Buku',
                    'data' => $bookshelves->pluck('books_count')->toArray(),
                    'backgroundColor' => [
                        '#3b82f6', 
                        '#10b981', 
                        '#f59e0b', 
                        '#ef4444',
                        '#8b5cf6', 
                        '#ec4899', 
                        '#06b6d4',
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