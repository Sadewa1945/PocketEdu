<?php

namespace App\Providers;

use App\Models\Borrowing;
use App\Models\ReturnBook;
use App\Observers\BorrowingObserver;
use App\Observers\ReturnBookObserver;
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
        ReturnBook::observe(ReturnBookObserver::class);
    }
}
