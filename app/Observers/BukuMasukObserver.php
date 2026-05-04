<?php

namespace App\Observers;

use App\Models\BukuMasuk;
use App\Models\Book;

class BukuMasukObserver
{
    /**
     * Handle the BukuMasuk "created" event.
     */
    public function created(BukuMasuk $bukuMasuk): void
    {
        $buku = Book::find($bukuMasuk->book_id);

        if($buku){
            $buku->increment('stock', $bukuMasuk->stock);

            if($bukuMasuk->book_price > $buku->book_price){
                $buku->update([
                    $buku->book_price = $bukuMasuk->book_price
                ]);
            }
        }
    }

    /**
     * Handle the BukuMasuk "updated" event.
     */
    public function updated(BukuMasuk $bukuMasuk): void
    {
        if ($bukuMasuk->wasChanged('stock')) {
            $buku = Book::find($bukuMasuk->book_id);
            
            if ($buku) {
                $selisih = $bukuMasuk->stock - $bukuMasuk->getOriginal('stock');
                $buku->increment('stock', $selisih);
            }
        }

        if ($bukuMasuk->wasChanged('book_price')) {
            $buku = Book::find($bukuMasuk->book_id);
            
            if ($buku) {
                $selisih = $bukuMasuk->book_price - $bukuMasuk->getOriginal('book_price');
                $buku->increment('book_price', $selisih);
            }
        }

        
    }

    /**
     * Handle the BukuMasuk "deleted" event.
     */
    public function deleted(BukuMasuk $bukuMasuk): void
    {
        $buku = Book::find($bukuMasuk->book_id);

        if($buku){
            $buku->decrement('stock', $bukuMasuk->stock);
        }
    }

    /**
     * Handle the BukuMasuk "restored" event.
     */
    public function restored(BukuMasuk $bukuMasuk): void
    {
        //
    }

    /**
     * Handle the BukuMasuk "force deleted" event.
     */
    public function forceDeleted(BukuMasuk $bukuMasuk): void
    {
        //
    }
}
