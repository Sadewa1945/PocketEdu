<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class UserStats extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $totalUsers = User::count();
        $adminUsers = User::where('role', 'admin')->count();
        $memberUsers = User::where('role', 'member')->count();

        return [
            Stat::make('Total Users', number_format($totalUsers))
                ->description('Total number of users in the system')
                ->descriptionIcon('heroicon-m-users')
                ->icon('heroicon-o-users')
                ->color('primary'),

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
        ];
    }
}