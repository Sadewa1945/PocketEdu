<?php

namespace App\Observers;

use App\Models\Book;
use App\Models\ReturnBook;
use App\Notifications\GeneralNotification;
use Carbon\Carbon;

class ReturnBookObserver
{
    /**
     * Handle the ReturnBook "created" event.
     */
    public function created(ReturnBook $returnBook): void
    {
       // 
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
    
        if ($returnBook->wasChanged('status')) {
            
            $borrowing = $returnBook->borrowing;
            if (!$borrowing) return;

            $user = $borrowing->user;
            $book = $borrowing->borrowingsBook;
            $bookTitle = $book->title ?? 'Buku';

            if ($returnBook->status === 'accepted') {
                
                if ($returnBook->returned_at && Carbon::parse($returnBook->returned_at)->format('H:i:s') === '00:00:00') {
                    $returnBook->updateQuietly(['returned_at' => now()]);
                }

                if ($book) {
                    $book->increment('stock', $returnBook->quantity_returned);
                }

                if ($user) {
                    $user->notify(new GeneralNotification(
                        'Return Accepted ✅', 
                        "The librarian has confirmed the return of the book '{$bookTitle}'. Thank you!"
                    ));
                }

                $totalAccepted = ReturnBook::where('borrowing_id', $borrowing->id)
                    ->where('status', 'accepted')
                    ->sum('quantity_returned');

                if ($totalAccepted >= $borrowing->quantity) {
                    $borrowing->update(['status' => 'returned']);
                }
            } 
            
            elseif ($returnBook->status === 'rejected') {
                
                if ($user) {
                    $user->notify(new GeneralNotification(
                        'Return Rejected ❌', 
                        "Sorry, book return request '{$bookTitle}' rejected. Please contact the officer."
                    ));
                }

                $borrowing->update(['status' => 'borrowed']);
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
