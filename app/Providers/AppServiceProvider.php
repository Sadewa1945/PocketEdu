<?php

namespace App\Providers;

use App\Models\Borrowing;
use App\Models\BukuMasuk;
use App\Models\ReturnBook;
use App\Observers\BorrowingObserver;
use App\Observers\BukuMasukObserver;
use App\Observers\ReturnBookObserver;
use Filament\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Borrowing::observe(BorrowingObserver::class);
        BukuMasuk::observe(BukuMasukObserver::class);
        ReturnBook::observe(ReturnBookObserver::class);

        ResetPassword::createUrlUsing(function ($user, string $token) {
        return 'http://localhost:8000/reset-password?token='.$token.'&email='.$user->email;
        });
    }
}
