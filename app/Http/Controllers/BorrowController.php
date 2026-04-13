<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Borrowing;
use App\Models\Stock;
use Illuminate\Http\Request;


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
        ]);
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
            'status' => 'pending',
        ]);

        $stock->decrement('available_stock', $validated['quantity']);

        return response()->json([
            'success' => true,
            'message' => 'Book borrowed successfully',
            'data' => $borrowing
        ]);

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
