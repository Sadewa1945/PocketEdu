<?php

namespace App\Observers;

use App\Models\Borrowing;
use App\Models\ReturnBook;
use App\Models\Stock;
use Carbon\Carbon;

class BorrowingObserver
{
    public function creating(Borrowing $borrowing): void
    {
        if ($borrowing->status === 'borrowed') {
            $now = now();
            
            $borrowing->borrowed_at = Carbon::parse($borrowing->borrowed_at)->setTimeFrom($now);
            
            if ($borrowing->due_at) {
                $borrowing->due_at = Carbon::parse($borrowing->due_at)->setTimeFrom($now);
            }
        } else {
    
            $borrowing->borrowed_at = Carbon::parse($borrowing->borrowed_at)->startOfDay();
            if ($borrowing->due_at) {
                $borrowing->due_at = Carbon::parse($borrowing->due_at)->startOfDay();
            }
        }
    }
    /**
     * Handle the Borrowing "created" event.
     */
    public function created(Borrowing $borrowing): void
    {
        //
    }

    public function updating(Borrowing $borrowing): void
    {
    
        if ($borrowing->isDirty('status') && $borrowing->status === 'borrowed') {
            
            $now = now(); 

            $borrowing->borrowed_at = Carbon::parse($borrowing->borrowed_at)->setTimeFrom($now);

            if ($borrowing->due_at) {
                $borrowing->due_at = Carbon::parse($borrowing->due_at)->setTimeFrom($now);
            }
        }
    }

    /**
     * Handle the Borrowing "updated" event.
     */
    public function updated(Borrowing $borrowing): void
    {
         if ($borrowing->isDirty('status') && $borrowing->status === 'borrowed'){
            if ($borrowing->getOriginal('status') !== 'borrowed'){
                $stock = Stock::where('book_id', $borrowing->book_id)->first();

                if ($stock && $stock->available_stock >= $borrowing->quantity) {
                $stock->decrement('available_stock', $borrowing->quantity);
                }
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
