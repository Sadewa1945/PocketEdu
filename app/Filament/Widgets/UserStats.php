<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class UserStats extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        return [
            stat::make('Total Users', User::count())
                ->description('Total number of users in the system')
                ->descriptionIcon('heroicon-o-users')
                ->color('primary'),

            stat::make('Admin Users', User::where ('role', 'admin')->count())
                ->description('Total number of admin users')
                ->descriptionIcon('heroicon-o-shield-check')
                ->color('success'),

            stat::make('Member Users', User::where ('role', 'member')->count())
                ->description('Total number of member users')
                ->descriptionIcon('heroicon-o-user')
                ->color('info'),

        ];
    }
}
