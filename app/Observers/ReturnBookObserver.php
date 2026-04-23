<?php

namespace App\Observers;

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
       if ($returnBook->status === 'accepted')
        {
            $this->processAcceptedReturn($returnBook);
        }
    }

    public function creating(ReturnBook $returnBook): void
    {
        if ($returnBook->status === 'accepted') {
            $returnBook->returned_at = now();
        } else {
            $returnBook->returned_at = $returnBook->returned_at 
                ? Carbon::parse($returnBook->returned_at)->startOfDay() 
                : null;
        }
    }

    /**
     * Handle the ReturnBook "updated" event.
     */
    public function updated(ReturnBook $returnBook): void
    {
        if ($returnBook->wasChanged('status')) {
            if ($returnBook->status === 'accepted') {
                $this->processAcceptedReturn($returnBook);
            } 
            elseif ($returnBook->status === 'rejected') {
                $this->processRejectedReturn($returnBook);
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

    public function processAcceptedReturn(ReturnBook $returnBook): void
    {
        $borrowing = $returnBook->borrowing;
        if (!$borrowing) return;

        $user = $borrowing->borrowingsUser;
        $book = $borrowing->borrowingsBook;
        $bookTitle = $book->title ?? 'Buku';

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

    protected function processRejectedReturn(ReturnBook $returnBook): void
    {
        $borrowing = $returnBook->borrowing;
        if (!$borrowing) return;

        $user = $borrowing->borrowingsUser;
        $bookTitle = $borrowing->borrowingsBook->title ?? 'Buku';

        if ($user) {
            $user->notify(new GeneralNotification(
                'Return Rejected ❌', 
                "Sorry, book return request '{$bookTitle}' rejected. Please contact the officer."
            ));
        }

        $isOverdue = Carbon::now()->isAfter($borrowing->due_at);
        $borrowing->update(['status' => $isOverdue ? 'overdue' : 'borrowed']);
    }
}
