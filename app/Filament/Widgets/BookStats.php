<?php

namespace App\Filament\Widgets;

// use App\Models\Book;
// use App\Models\Books;
// use App\Models\Categories;
// use Filament\Widgets\StatsOverviewWidget as BaseWidget;
// use Filament\Widgets\StatsOverviewWidget\Stat;
// use Illuminate\Support\Facades\DB;

// class BookStats extends BaseWidget
// {
//     protected static ?int $sort = 2;
    
//     protected function getStats(): array
//     {
//         // Total buku
//         $totalBooks = Book::count();
        
//         // Buku bulan ini vs bulan lalu
//         $currentMonth = Book::whereMonth('created_at', now()->month)
//             ->whereYear('created_at', now()->year)
//             ->count();
            
//         $lastMonth = Book::whereMonth('created_at', now()->subMonth()->month)
//             ->whereYear('created_at', now()->subMonth()->year)
//             ->count();
            
//         $percentageChange = $lastMonth > 0 
//             ? round((($currentMonth - $lastMonth) / $lastMonth) * 100, 1)
//             : 0;

//         // Total stok vs stok tersedia
//         $totalStock = Book::sum('total_stock');
//         $availableStock = Book::sum('available_stock');
//         $borrowedStock = $totalStock - $availableStock;
//         $availabilityRate = $totalStock > 0 
//             ? round(($availableStock / $totalStock) * 100, 1)
//             : 0;

//         // Buku dipinjam (stok habis atau berkurang)
//         $borrowedBooks = Book::whereColumn('available_stock', '<', 'total_stock')->count();

//         // Kategori terpopuler
//         $topCategory = Book::select('categories_id', DB::raw('count(*) as total'))
//             ->groupBy('categories_id')
//             ->orderBy('total', 'desc')
//             ->with('categories')
//             ->first();

//         $topCategoryName = $topCategory && $topCategory->categories 
//             ? $topCategory->categories->name 
//             : 'N/A';

//         return [
//             Stat::make('Total Buku', $totalBooks)
//                 ->description($topCategory 
//                     ? "Terbanyak: {$topCategoryName}" 
//                     : 'Belum ada kategori')
//                 ->descriptionIcon('heroicon-m-book-open')
//                 ->icon('heroicon-o-book-open')
//                 ->color('primary')
//                 ->chart([
//                     Book::whereDate('created_at', now()->subDays(6))->count(),
//                     Book::whereDate('created_at', now()->subDays(5))->count(),
//                     Book::whereDate('created_at', now()->subDays(4))->count(),
//                     Book::whereDate('created_at', now()->subDays(3))->count(),
//                     Book::whereDate('created_at', now()->subDays(2))->count(),
//                     Book::whereDate('created_at', now()->subDays(1))->count(),
//                     Book::whereDate('created_at', today())->count(),
//                 ]),
            
//             Stat::make('Buku Ditambahkan Bulan Ini', $currentMonth)
//                 ->description($percentageChange >= 0 
//                     ? "+{$percentageChange}% dari bulan lalu" 
//                     : "{$percentageChange}% dari bulan lalu")
//                 ->descriptionIcon($percentageChange >= 0 
//                     ? 'heroicon-m-arrow-trending-up' 
//                     : 'heroicon-m-arrow-trending-down')
//                 ->icon('heroicon-o-plus-circle')
//                 ->color($percentageChange >= 0 ? 'success' : 'danger'),
            
//             Stat::make('Ketersediaan Stok', "{$availableStock} / {$totalStock}")
//                 ->description("{$availabilityRate}% buku tersedia ({$borrowedStock} sedang dipinjam)")
//                 ->descriptionIcon('heroicon-m-check-circle')
//                 ->icon('heroicon-o-archive-box')
//                 ->color($availabilityRate > 70 ? 'success' : ($availabilityRate > 40 ? 'warning' : 'danger')),
            
//             Stat::make('Buku Sedang Dipinjam', $borrowedBooks)
//                 ->description(round(($borrowedBooks / max($totalBooks, 1)) * 100, 1) . '% dari total koleksi')
//                 ->descriptionIcon('heroicon-m-arrow-right-circle')
//                 ->icon('heroicon-o-arrow-path')
//                 ->color('info'),
//         ];
//     }
// }