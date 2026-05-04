<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Borrowing;
use Carbon\Carbon;

class UpdateOverdueBorrowings extends Command
{
    protected $signature = 'borrowings:update-status';
    protected $description = 'Update the loan status to overdue (if already borrowed) or expired (if still pending)';

    public function handle(): void
    {
        $now = Carbon::now('Asia/Jakarta');

        $overdueCount = Borrowing::where('status', 'borrowed')
            ->where('due_at', '<', $now)
            ->update(['status' => 'overdue']);

        $expiredCount = Borrowing::where('status', 'pending')
            ->where('borrowed_at', '<', $now)
            ->update(['status' => 'expired']);

        $this->info("Task Done: {$overdueCount} overdue, {$expiredCount} expired.");
    }
}