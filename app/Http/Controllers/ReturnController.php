<?php

namespace App\Http\Controllers;

use App\Models\Borrowing;
use App\Models\ReturnBook;
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

        if($borrowing -> status !== 'borrowed'){
            return response()->json([
                'message' => 'The book is not being borrowed or has already been returned',
            ], 400);
        }

        $request->validate([
            'return_condition' => 'required|string',
            'notes' => 'nullable|string'
        ]);

        $alreadyReturned = ReturnBook::where('borrowing_id', $borrowing->id)->exists();

        if ($alreadyReturned){
            return response()->json([
                'message' => 'Return data already exists',
            ], 400);
        }

        $return = ReturnBook::create([
            'borrowing_id' => $borrowing->id,
            'returned_at' => now(),
            'return_condition' => $request->return_condition,
            'notes' => $request->notes,
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Return request submitted',
            'data' => $return
        ], 200);
    }

    public function approveReturn($id){

        $return = ReturnBook::findOrFail($id);

        if ($return->status !== 'pending'){
            return response()->json([
                'message' => 'Return is not pending'
            ], 400);
        }

        $return->update([
            'status' => 'accepted',
            'returned_at' => Carbon::now()
        ]);

        $return->borrowing->update([
            'status' => 'returned',
        ]);

        return response()->json([
            'message' => 'Return approved successfully'
        ], 200);
    }

    public function rejectRetuns($id)
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
