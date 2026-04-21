<?php

use App\Models\Borrowing;
use App\Notifications\GeneralNotification;
use Carbon\Carbon;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('borrowings:update-overdue')->everyMinute();

Schedule::call(function () {
    $tomorrow = Carbon::tomorrow('Asia/Jakarta')->toDateString();

    $reminders = Borrowing::with(['user', 'borrowingsBook'])
                ->whereDate('due_at', $tomorrow)
                ->where('status', 'borrowed')
                ->get();

    foreach ($reminders as $borrowing) {
        if ($borrowing->user) {
            $bookTitle = $borrowing->borrowingsBook->title ?? 'Buku';
            $borrowing->user->notify(new GeneralNotification(
                'Return Reminder ⏰', 
                "Books '{$bookTitle}' It's due tomorrow. Please return it immediately!"
            ));
        }
    }
})->everyMinute();