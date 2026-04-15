<?php

namespace App\Http\Controllers;

use App\Models\Borrowing;
use App\Models\ReturnBook;
use App\Models\Stock;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ReturnController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $data = ReturnBook::with(['borrowing.borrowingsBook']) 
            ->whereHas('borrowing', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data
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
            'return_condition' => 'nullable|string',
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

        $borrowing->updated([
            'status' => 'waiting_to_be_returned'
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

    $return->borrowing->update([
        'status' => 'returned'
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

        $isOverdue = \Carbon\Carbon::now()->isAfter($return->borrowing->due_at);

        $return->borrowing->update([
        'status' => $isOverdue ? 'overdue' : 'borrowed'
        ]);

        return response()->json([
            'message' => 'Return rejected successfully'
        ]);
    }
}
