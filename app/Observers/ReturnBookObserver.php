<?php

namespace App\Observers;

use App\Models\Book;
use App\Models\ReturnBook;
use Carbon\Carbon;

class ReturnBookObserver
{
    /**
     * Handle the ReturnBook "created" event.
     */
    public function created(ReturnBook $returnBook): void
    {
        
    }

    public function creating(ReturnBook $returnBook): void
    {
        if ($returnBook->status === 'accepted') {
            $returnBook->returned_at = now();
        } else {
            $returnBook->returned_at = Carbon::parse($returnBook->returned_at)->startOfDay();
        }
    }

    /**
     * Handle the ReturnBook "updated" event.
     */
    public function updated(ReturnBook $returnBook): void
    {
    
        if ($returnBook->wasChanged('status') && $returnBook->status === 'accepted') {
            
            if (Carbon::parse($returnBook->returned_at)->format('H:i:s') === '00:00:00') {
                $returnBook->updateQuietly([
                    'returned_at' => now()
                ]);
            }

            $borrowing = $returnBook->borrowing;
            if ($borrowing) {
               $book = Book::find($borrowing->book_id);

               if ($book){
                $book->increment('stock', $returnBook->quantity_returned);
               }

                $totalAccepted = ReturnBook::where('borrowing_id', $borrowing->id)
                    ->where('status', 'accepted')
                    ->sum('quantity_returned');

                if ($totalAccepted >= $borrowing->quantity) {
                    $borrowing->update(['status' => 'returned']);
                }
            }
        }
    }

    /**
     * Handle the ReturnBook "deleted" event.
     */
    public function deleted(ReturnBook $returnBook): void
    {
        //
    }

    /**
     * Handle the ReturnBook "restored" event.
     */
    public function restored(ReturnBook $returnBook): void
    {
        //
    }

    /**
     * Handle the ReturnBook "force deleted" event.
     */
    public function forceDeleted(ReturnBook $returnBook): void
    {
        //
    }
}
