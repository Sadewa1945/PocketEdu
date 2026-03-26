<?php

namespace App\Filament\Widgets;

use App\Models\User;
use App\Models\Student;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class UserStats extends BaseWidget
{
    protected static ?int $sort = 1;
    
    protected function getStats(): array
    {
        // Total users
        $totalUsers = User::count();
        
        // User bulan ini vs bulan lalu
        $currentMonth = User::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
            
        $lastMonth = User::whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->count();
            
        $percentageChange = $lastMonth > 0 
            ? round((($currentMonth - $lastMonth) / $lastMonth) * 100, 1)
            : 0;

        // User admin vs non-admin
        $adminUsers = User::where('role', 'admin')->count();
        $regularUsers = $totalUsers - $adminUsers;

        // User dengan student profile
        $usersWithStudent = User::whereHas('classes')->count();

        // User baru hari ini
        $todayUsers = User::whereDate('created_at', today())->count();

        // User 7 hari terakhir
        $weekUsers = User::where('created_at', '>=', now()->subDays(7))->count();

        return [
            Stat::make('Total Users', $totalUsers)
                ->description("{$adminUsers} Admin, {$regularUsers} Reguler")
                ->descriptionIcon('heroicon-m-user-group')
                ->icon('heroicon-o-users')
                ->color('primary')
                ->chart([
                    User::whereDate('created_at', now()->subDays(6))->count(),
                    User::whereDate('created_at', now()->subDays(5))->count(),
                    User::whereDate('created_at', now()->subDays(4))->count(),
                    User::whereDate('created_at', now()->subDays(3))->count(),
                    User::whereDate('created_at', now()->subDays(2))->count(),
                    User::whereDate('created_at', now()->subDays(1))->count(),
                    $todayUsers,
                ]),
            
            Stat::make('User Baru Bulan Ini', $currentMonth)
                ->description($percentageChange >= 0 
                    ? "{$percentageChange}% dari bulan lalu" 
                    : "{$percentageChange}% dari bulan lalu")
                ->descriptionIcon($percentageChange >= 0 
                    ? 'heroicon-m-arrow-trending-up' 
                    : 'heroicon-m-arrow-trending-down')
                ->icon('heroicon-o-user-plus')
                ->color($percentageChange >= 0 ? 'success' : 'danger'),
            
            Stat::make('User dengan Profile', $usersWithStudent)
                ->description(round(($usersWithStudent / max($totalUsers, 1)) * 100, 1) . '% memiliki data siswa')
                ->descriptionIcon('heroicon-m-academic-cap')
                ->icon('heroicon-o-identification')
                ->color('info'),
            
            Stat::make('Registrasi Minggu Ini', $weekUsers)
                ->description("{$todayUsers} registrasi hari ini")
                ->descriptionIcon('heroicon-m-calendar')
                ->icon('heroicon-o-calendar-days')
                ->color('warning'),
        ];
    }
}