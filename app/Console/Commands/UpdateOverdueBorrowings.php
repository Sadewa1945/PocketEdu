<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Borrowing;
use Carbon\Carbon;

class UpdateOverdueBorrowings extends Command
{
    protected $signature = 'borrowings:update-overdue';

    public function handle(): void
    {
        Borrowing::where('status', 'borrowed')
        ->where('due_at', '<', Carbon::now('Asia/Jakarta'))
        ->update([
            'status' => 'overdue'
        ]);
    }
}