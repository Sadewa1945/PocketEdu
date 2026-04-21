<?php

namespace App\Http\Controllers;

use App\Models\Borrowing;
use App\Models\Fine;
use App\Models\FinesSettings;
use App\Models\ReturnBook;
use App\Models\Review;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ReturnController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $data = ReturnBook::with(['borrowing.borrowingsBook', 'fines']) 
            ->whereHas('borrowing', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->get();

        $data->map(function ($return) use ($user) {
            $bookId = $return->borrowing->borrowingsBook->id ?? null;
            
            if ($bookId) {
                $return->is_reviewed = Review::where('user_id', $user->id)
                    ->where('book_id', $bookId)
                    ->exists();
            } else {
                $return->is_reviewed = false;
            }
            
            return $return;
        });

        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
    }

    public function show($id)
    {
        $borrowingsBook = Borrowing::with('borrowingsBook')->find($id);

        if (!$borrowingsBook) {
            return response()->json([
                'message' => false,
                'data' => null
            ], 404);
        }

        $book = $borrowingsBook->borrowingsBook;
        $bookPrice = $book ? $book->book_price : 0; 

        $lateDays = 0;
        $dueDate = Carbon::parse($borrowingsBook->due_at)->startOfDay();
        $today = Carbon::now()->startOfDay();
        
        if ($today->gt($dueDate)) {
            $lateDays = (int) $dueDate->diffInDays($today);
        }

        $allSettings = FinesSettings::all();
        $rates = [];

        foreach ($allSettings as $setting) {
            $rates[$setting->key] = $setting->type === 'percentage' 
                ? ($setting->value / 100) * $bookPrice 
                : (int) $setting->value;
        }

        return response()->json([
            'message' => true,
            'data' => $borrowingsBook,
            'late_days' => $lateDays,
            'fine_rates' => $rates 
        ], 200);
    }

   public function storeReturn(Request $request, $id)
    {
        $borrowing = Borrowing::findOrFail($id);

        if ($borrowing->user_id !== auth()->id()){
            return response()->json([
                'message' => 'Unauthorized. You do not own this borrowing record.',
            ], 403);
        }

        if (!in_array($borrowing->status, ['borrowed', 'overdue'])) {
            return response()->json([
                'message' => 'This book is not currently on loan or has been returned.',
            ], 400);
        }

        $request->validate([
            'quantity_returned' => 'required|integer|min:1',
            'return_condition' => 'required|in:good,damaged,lost',
            'notes' => 'nullable|string'
        ]);

        $totalAlreadyReturned = ReturnBook::where('borrowing_id', $borrowing->id)
            ->whereIn('status', ['pending', 'accepted'])
            ->sum('quantity_returned');

        if (($totalAlreadyReturned + $request->quantity_returned) > $borrowing->quantity) {
            return response()->json([
                'message' => 'The number of books returned exceeds the number borrowed.',
            ], 400);
        }

        $return = ReturnBook::create([
            'borrowing_id' => $borrowing->id,
            'returned_at' => now()->startOfDay(),
            'quantity_returned' => $request->quantity_returned,
            'return_condition' => $request->return_condition,
            'notes' => $request->notes,
            'status' => 'pending'
        ]);

        $this->calculateAndCreateFines($borrowing, $return, $request->return_condition);

        $borrowing->update([
            'status' => 'waiting_to_be_returned'
        ]);

        return response()->json([
            'message' => 'Return request submitted',
            'data' => $return
        ], 200);
    }

    private function calculateAndCreateFines($borrowing, $return, $condition)
    {
        $userId = $borrowing->user_id;
        $returnId = $return->id;

        $book = $borrowing->borrowingsBook;
        $bookPrice = $book ? $book->book_price : 0; 

        $dueDate = Carbon::parse($borrowing->due_at)->startOfDay();
        $returnedDate = Carbon::now()->startOfDay();

        if ($returnedDate->gt($dueDate)) {
            $lateDays = (int) $dueDate->diffInDays($returnedDate);
    
            $this->applyDynamicFine('late_fine', $returnId, $userId, $bookPrice, $lateDays);
        }

        if ($condition !== 'good') {
    
            $settingKey = $condition === 'damaged' ? 'damage_fine' : $condition . '_fine';
            
            $this->applyDynamicFine($settingKey, $returnId, $userId, $bookPrice, 1);
        }
    }

    private function applyDynamicFine($settingKey, $returnId, $userId, $bookPrice, $multiplier = 1)
    {
        $setting = FinesSettings::where('key', $settingKey)->first();

        if ($setting) {
            $amount = 0;

            if ($setting->type === 'percentage') {
                $amount = ($setting->value / 100) * $bookPrice * $multiplier;
            } else {
                $amount = $setting->value * $multiplier;
            }

            if ($amount > 0) {
                Fine::create([
                    'return_book_id' => $returnId,
                    'user_id' => $userId,
                    'fine_type_id' => $setting->id, 
                    'amount' => $amount,
                    'status' => 'unpaid'
                ]);
            }
        }
    }

}
