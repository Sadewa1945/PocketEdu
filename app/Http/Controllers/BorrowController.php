<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Borrowing;
use App\Models\Setting;
use App\Models\Stock;
use Illuminate\Http\Request;
use Carbon\Carbon;

class BorrowController extends Controller
{
    public function index(Request $request){
        $user = $request->user();

        $borrow = Borrowing::with('borrowingsBook')
            ->where('user_id', $user->id)
            ->get();

        return response()->json([
            'message' => true,
            'data' => $borrow
        ], 200);
    }

    public function show($id)
    {
        $borrowingsBook = Borrowing::with('borrowingsBook')->find($id);

        if(!$borrowingsBook){
            return response()->json([
                'message' => false,
                'data' => null
            ], 404);
        }

        $lateDays = 0;
        $dueDate = Carbon::parse($borrowingsBook->due_at)->startOfDay();
        $today = now()->startOfDay();
        
        if ($today->isAfter($dueDate)) {
            $lateDays = $today->diffInDays($dueDate);
        }

        $rates = [
            'late_fine' => Setting::getValue('late_fine', 2000),
            'damage_fine' => Setting::getValue('damage_fine', 50000),
            'lost_fine' => Setting::getValue('lost_fine', 100000),
        ];

        return response()->json([
            'message' => true,
            'data' => $borrowingsBook,
            'late_days' => $lateDays, 
            'fine_rates' => $rates    
        ], 200);
        }

        public function borrowingsCount(){
        $count = borrowing::where('status', 'borrowed')->count();

        return response()->json([
            'message' => true,
            'data' => $count
        ], 200);
    }

        public function borrow(Request $request){
        try{
            $validated = $request->validate([
                'book_id' => 'required|exists:books,id',
                'quantity' => 'required|integer|min:1',
                'borrowed_at' => 'required|date|after_or_equal:today',
                'due_at' => 'required|date|after_or_equal:today',
                'notes' => 'nullable|string|max:500'
            ]);

            $user = $request->user();
            $book = Book::findOrFail($validated['book_id']);

            $activeLoans = Borrowing::where('user_id', $user->id)
                ->whereIn('status', ['pending', 'prepared', 'ready_to_pickup', 'borrowed'])
                ->count();

            if ($activeLoans >= 5){
                return response()->json([
                    'success' => false,
                    'message' => 'your borrowing exceeds the limit'
                ], 422);
            }

            $stock = Stock::where('book_id', $book->id)->first();

            if(!$stock || $stock->available_stock < $validated['quantity']){
                return response()->json([
                    'success' => false,
                    'message' => 'Book stock is not available',
                    'available' => $stock?->available_stock ?? 0
                ], 422);
            }

            $borrowing = Borrowing::create([
                'user_id' => $user->id,
                'book_id' => $book->id,
                'quantity' => $validated['quantity'],
                'borrowed_at' => $validated['borrowed_at'],
                'due_at' => $validated['due_at'],
                'notes' => $validated['notes'],
                'status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Book borrowed successfully',
                'data' => $borrowing
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan pada server'
            ], 500);
        }
    }
}
