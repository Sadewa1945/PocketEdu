<?php

namespace App\Filament\Widgets;

use App\Models\Borrowing;
use App\Models\Fine;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class UserStats extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $bookBorrow = Borrowing::where('status', 'borrowed')->count();
        $adminUsers = User::where('role', 'admin')->count();
        $memberUsers = User::where('role', 'member')->count();
        $fineTotal = Fine::where('status', 'paid')
            ->whereYear('paid_at', now()->year)
            ->whereMonth('paid_at', now()->month)
            ->sum('amount');

        return [

            Stat::make('Admin Users', $adminUsers)
                ->description('Total number of admin users')
                ->descriptionIcon('heroicon-m-shield-check')
                ->icon('heroicon-o-shield-check')
                ->color('success'),

            Stat::make('Member Users', $memberUsers)
                ->description('Total number of member users')
                ->descriptionIcon('heroicon-m-user')
                ->icon('heroicon-o-user')
                ->color('info'),

            Stat::make('Book Borrowed', $bookBorrow)
                ->description('Total borrowed books')
                ->descriptionIcon('heroicon-o-book-open')
                ->icon('heroicon-o-book-open')
                ->color('warning'),

            Stat::make('Fine Income', 'Rp ' . number_format($fineTotal, 0, ',', '.'))
                ->description('Total fines paid this month')
                ->descriptionIcon('heroicon-m-banknotes')
                ->icon('heroicon-o-banknotes')
                ->color('success'),
        ];
    }
}