<?php

namespace App\Observers;

use App\Models\Book;
use App\Models\Borrowing;
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
        if (in_array($borrowing->status, ['accepted', 'borrowed'])) {
            $book = Book::find($borrowing->book_id);
            if ($book && $book->stock >= $borrowing->quantity) {
                $book->decrement('stock', $borrowing->quantity);
            }
        }
    }

    public function updating(Borrowing $borrowing): void
    {
    
        $originalBorrowedAt = $borrowing->getOriginal('borrowed_at');
        $originalDueAt = $borrowing->getOriginal('due_at');

        $oldBorrowedTime = $originalBorrowedAt ? Carbon::parse($originalBorrowedAt)->format('H:i:s') : '00:00:00';
        $oldDueTime = $originalDueAt ? Carbon::parse($originalDueAt)->format('H:i:s') : '00:00:00';

        if ($borrowing->isDirty('status') && $borrowing->status === 'borrowed') {
            
            $timeToInject = ($oldBorrowedTime !== '00:00:00') ? Carbon::parse($originalBorrowedAt) : now();

            $borrowing->borrowed_at = Carbon::parse($borrowing->borrowed_at)->setTimeFrom($timeToInject);

            if ($borrowing->due_at) {
                $dueTimeToInject = ($oldDueTime !== '00:00:00') ? Carbon::parse($originalDueAt) : now();
                $borrowing->due_at = Carbon::parse($borrowing->due_at)->setTimeFrom($dueTimeToInject);
            }
            
        } else {
            if ($oldBorrowedTime !== '00:00:00') {
                $borrowing->borrowed_at = Carbon::parse($borrowing->borrowed_at)->setTimeFrom(Carbon::parse($originalBorrowedAt));
            }
            if ($borrowing->due_at && $oldDueTime !== '00:00:00') {
                $borrowing->due_at = Carbon::parse($borrowing->due_at)->setTimeFrom(Carbon::parse($originalDueAt));
            }
        }
    }

    /**
     * Handle the Borrowing "updated" event.
     */
    public function updated(Borrowing $borrowing): void
    {
         if ($borrowing->isDirty('status')) {
            $newStatus = $borrowing->status;
            $oldStatus = $borrowing->getOriginal('status');
            
            $book = Book::find($borrowing->book_id);
            if (!$book) return;

            if ($oldStatus === 'pending' && in_array($newStatus, ['accepted', 'borrowed'])) {
                if ($book->stock >= $borrowing->quantity) {
                    $book->decrement('stock', $borrowing->quantity);
                }
            }

            $stockDeductedStatuses = ['accepted', 'prepared', 'ready_to_pickup', 'borrowed', 'overdue', 'waiting_to_be_returned'];
            
            if (in_array($oldStatus, $stockDeductedStatuses) && $newStatus === 'rejected') {
                $book->increment('stock', $borrowing->quantity);
            }
         }
    }

    /**
     * Handle the Borrowing "deleted" event.
     */
    public function deleted(Borrowing $borrowing): void
    {
        $book = Book::find($borrowing->book_id);
        $stockDeductedStatuses = ['accepted', 'prepared', 'ready_to_pickup', 'borrowed', 'overdue', 'waiting_to_be_returned'];
        
        if ($book && in_array($borrowing->status, $stockDeductedStatuses)) {
            $book->increment('stock', $borrowing->quantity);
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
