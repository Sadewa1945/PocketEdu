<?php

namespace App\Observers;

use App\Models\ReturnBook;
use App\Models\Stock;
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
            // Jika admin buat langsung accepted, kasih jam sekarang
            $returnBook->returned_at = now();
        } else {
            // Jika status pending, paksa jam ke 00:00:00 sebelum save
            $returnBook->returned_at = Carbon::parse($returnBook->returned_at)->startOfDay();
        }
    }

    /**
     * Handle the ReturnBook "updated" event.
     */
    public function updated(ReturnBook $returnBook): void
    {
    
    // Logika jam saat perubahan status dari pending ke accepted
        if ($returnBook->wasChanged('status') && $returnBook->status === 'accepted') {
            
            // Update jam ke waktu sekarang jika sebelumnya masih 00:00:00
            if (Carbon::parse($returnBook->returned_at)->format('H:i:s') === '00:00:00') {
                $returnBook->updateQuietly([
                    'returned_at' => now()
                ]);
            }

            // --- Logika Stok & Status Peminjaman ---
            $borrowing = $returnBook->borrowing;
            if ($borrowing) {
                $stock = \App\Models\Stock::where('book_id', $borrowing->book_id)->first();
                if ($stock) {
                    $stock->increment('available_stock', $returnBook->quantity_returned);
                }

                $totalAccepted = \App\Models\ReturnBook::where('borrowing_id', $borrowing->id)
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
