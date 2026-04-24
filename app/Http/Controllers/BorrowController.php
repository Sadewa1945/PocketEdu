<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Borrowing;
use App\Models\FinesSettings;
use App\Notifications\GeneralNotification;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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
            'late_fine' => FinesSettings::getValue('late_fine', 2000),
            'damage_fine' => FinesSettings::getValue('damage_fine', 50000),
            'lost_fine' => FinesSettings::getValue('lost_fine', 100000),
        ];

        return response()->json([
            'message' => true,
            'data' => $borrowingsBook,
            'late_days' => $lateDays, 
            'fine_rates' => $rates    
        ], 200);
    }

    public function borrowingsCount(Request $request){
        $user = $request->user();

        $count = Borrowing::where('user_id', $user->id)
            ->whereIn('status', 'borrowed') 
            ->count();

        return response()->json([
            'message' => true,
            'data' => $count
        ], 200);
    }

    public function overdueCount(Request $request){
        $user = $request->user();

        $count = Borrowing::where('user_id', $user->id)
            ->where('status', 'overdue')
            ->count();

        return response()->json([
            'message' => true,
            'data' => $count
        ], 200);
    }

    public function borrow(Request $request)
    {
        try {
            $validated = $request->validate([
                'book_id' => 'nullable|exists:books,id',
                'book_ids' => 'nullable|array|max:3',
                'book_ids.*' => 'exists:books,id',
                'borrowed_at' => 'required|date|after_or_equal:today',
                'due_at' => 'required|date',
                'notes' => 'nullable|string|max:500'
            ]);

            if (empty($validated['book_id']) && empty($validated['book_ids'])) {
                return response()->json(['success' => false, 'message' => 'Pilih setidaknya 1 buku.'], 422);
            }

            $bookIds = !empty($validated['book_ids']) ? $validated['book_ids'] : [$validated['book_id']];

            $borrowedAt = Carbon::parse($validated['borrowed_at']);
            $dueAt = Carbon::parse($validated['due_at']);
            $maxDueDate = $borrowedAt->copy()->addWeek();

            if ($dueAt->lt($borrowedAt)) {
                return response()->json(['success' => false, 'message' => 'Tanggal kembali tidak boleh sebelum tanggal pinjam.'], 422);
            }

            if ($dueAt->gt($maxDueDate)) {
                return response()->json(['success' => false, 'message' => 'Maksimal peminjaman adalah 1 minggu (7 hari).'], 422);
            }

            $user = $request->user();

            $hasPending = Borrowing::where('user_id', $user->id)->where('status', 'pending')->exists();
            if ($hasPending) {
                return response()->json(['success' => false, 'message' => 'Anda masih memiliki permintaan peminjaman pending. Mohon tunggu persetujuan admin.'], 422);
            }

            $activeLoans = Borrowing::where('user_id', $user->id)
                ->whereIn('status', ['pending', 'prepared', 'ready_to_pickup', 'borrowed'])
                ->count();

            if (($activeLoans + count($bookIds)) > 3) {
                return response()->json(['success' => false, 'message' => 'Peminjaman ini melebihi batas maksimal peminjaman (3 buku).'], 422);
            }

            DB::beginTransaction();
            $borrowings = [];

            foreach ($bookIds as $id) {
                $book = Book::findOrFail($id);

                $alreadyBorrowed = Borrowing::where('user_id', $user->id)
                    ->where('book_id', $book->id)
                    ->whereIn('status', ['borrowed'])
                    ->exists();

                if ($alreadyBorrowed) {
                    DB::rollBack();
                    return response()->json(['success' => false, 'message' => "Buku '{$book->title}' sudah dipinjam dan belum dikembalikan."], 422);
                }

                if ($book->stock < 1) {
                    DB::rollBack();
                    return response()->json(['success' => false, 'message' => "Stok buku '{$book->title}' tidak tersedia."], 422);
                }

                $borrowings[] = Borrowing::create([
                    'user_id' => $user->id,
                    'book_id' => $book->id,
                    'quantity' => 1,
                    'borrowed_at' => $validated['borrowed_at'],
                    'due_at' => $validated['due_at'],
                    'notes' => $validated['notes'] ?? null,
                    'status' => 'pending',
                ]);
            }

            DB::commit(); 

            $bookTitles = Book::whereIn('id', $bookIds)->pluck('title')->implode(', ');
            $user->notify(new GeneralNotification(
                'Request Sent!', 
                "Request to borrow '{$bookTitles}' submitted successfully. Please wait for Librarian approval."
            ));

            return response()->json([
                'success' => true,
                'message' => count($bookIds) . ' Book(s) borrowed successfully',
                'data' => $borrowings
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack(); // Batalkan jika ada error fatal
            return response()->json([
                'success' => false,
                'message' => 'An error occurred on the server',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
