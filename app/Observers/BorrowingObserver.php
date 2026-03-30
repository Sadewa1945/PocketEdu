<?php

namespace App\Observers;

use App\Models\Borrowing;
use App\Models\Stock;

class BorrowingObserver
{
    /**
     * Handle the Borrowing "created" event.
     */
    public function created(Borrowing $borrowing): void
    {
        $stock = Stock::where('book_id', $borrowing->book_id)->first();
        
        if ($stock && $stock->available_stock >= $borrowing->quantity) {
            $stock->decrement('available_stock', $borrowing->quantity);
        }
    }

    /**
     * Handle the Borrowing "updated" event.
     */
    public function updated(Borrowing $borrowing): void
    {
         if ($borrowing->isDirty('status') && $borrowing->status === 'returned') {
            $stock = Stock::where('book_id', $borrowing->book_id)->first();
            if ($stock) {
                $stock->increment('available_stock', $borrowing->available_stock);
            }
        }
    }

    /**
     * Handle the Borrowing "deleted" event.
     */
    public function deleted(Borrowing $borrowing): void
    {
        $stock = Stock::where('book_id', $borrowing->book_id)->first();
        
        if ($stock) {
            $stock->increment('available_stock', $borrowing->quantity);
        }
    }

    /**
     * Handle the Borrowing "restored" event.
     */
    public function restored(Borrowing $borrowing): void
    {
        //
    }

    /**
     * Handle the Borrowing "force deleted" event.
     */
    public function forceDeleted(Borrowing $borrowing): void
    {
        //
    }
}
