<?php

namespace App\Filament\Widgets;

use App\Models\Book;
use App\Models\Borrowing;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Carbon\Carbon;

class DashboardStats extends BaseWidget
{
    protected static ?int $sort = 2;

    protected function getStats(): array
    {
        $totalBooks = Book::count();
        $activeBorrowings = Borrowing::where('status', 'borrowed')->count();
        $overdueBorrowings = Borrowing::where('status', 'borrowed')
            ->where('due_at', '<', Carbon::now())
            ->count();

        return [
            Stat::make('Book Catalog', number_format($totalBooks))
                ->description('Total registered book titles')
                ->descriptionIcon('heroicon-m-book-open')
                ->icon('heroicon-o-book-open')
                ->color('primary'),

            Stat::make('Currently Borrowed', $activeBorrowings)
                ->description($activeBorrowings . ' active borrowings right now')
                ->descriptionIcon('heroicon-m-arrow-right-circle')
                ->icon('heroicon-o-arrow-right-on-rectangle')
                ->color('warning'),

            Stat::make('Overdue', $overdueBorrowings)
                ->description(
                    $overdueBorrowings > 0
                        ? $overdueBorrowings . ' books past their due date'
                        : 'All borrowings are on time'
                )
                ->descriptionIcon(
                    $overdueBorrowings > 0
                        ? 'heroicon-m-exclamation-triangle'
                        : 'heroicon-m-check-circle'
                )
                ->icon('heroicon-o-exclamation-triangle')
                ->color($overdueBorrowings > 0 ? 'danger' : 'success'),
        ];
    }
}