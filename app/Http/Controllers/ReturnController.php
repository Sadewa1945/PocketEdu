<?php

namespace App\Http\Controllers;

use App\Models\Borrowing;
use App\Models\ReturnBook;
use App\Models\Stock;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ReturnController extends Controller
{
    public function show(Request $request)
    {
        $userId = auth()->id();

        $data = ReturnBook::with(['borrowing.book'])
            ->whereHas('borrowing', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            })
            ->get();

        return response()->json([
            'message' => true,
            'data' => $data
        ], 200);
    }

    public function storeReturn(Request $request, $id)
    {
        $borrowing = Borrowing::findOrFail($id);

        // Pastikan statusnya valid
        if (!in_array($borrowing->status, ['borrowed', 'overdue'])) {
            return response()->json([
                'message' => 'This book is not currently on loan or has been returned.',
            ], 400);
        }

        $request->validate([
            'quantity_returned' => 'required|integer|min:1',
            'return_condition' => 'required|string',
            'notes' => 'nullable|string'
        ]);

        // Hitung total buku yang sudah diajukan pengembaliannya agar user tidak mengembalikan lebih dari yang dipinjam
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

        return response()->json([
            'message' => 'Return request submitted',
            'data' => $return
        ], 200);
    }

    public function approveReturn($id)
{
    $return = ReturnBook::with('borrowing')->findOrFail($id);

    if ($return->status !== 'pending') {
        return response()->json(['message' => 'Return is not pending'], 400);
    }

    $return->update([
        'status' => 'accepted',
        'returned_at' => \Carbon\Carbon::now(),
    ]);

    return response()->json([
        'message' => 'Return approved successfully',
        'data' => $return
    ], 200);
}

    public function rejectReturn($id)
    {
        $return = ReturnBook::findOrFail($id);

        if ($return->status !== 'pending') {
            return response()->json([
                'message' => 'Return is not pending'
            ], 400);
        }

        $return->update([
            'status' => 'rejected'
        ]);

        return response()->json([
            'message' => 'Return rejected successfully'
        ]);
    }

    public function getMyReturns()
    {
        $data = ReturnBook::with(['borrowing.book'])
            ->whereHas('borrowing', function ($q) {
                $q->where('user_id', auth()->id());
            })
            ->get();

        return response()->json($data);
    }
}
