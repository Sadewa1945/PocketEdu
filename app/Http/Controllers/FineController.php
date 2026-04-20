<?php

namespace App\Http\Controllers;

use App\Models\Fine;
use Illuminate\Http\Request;

class FineController extends Controller
{
    public function getAmount(Request $request)
    {
        $user = $request->user();

        $semuaDendaUser = Fine::where('user_id', $user->id)->get();

        
        $totalUnpaid = Fine::where('user_id', $user->id)
            ->where('status', 'unpaid')
            ->sum('amount');

        
        return response()->json([
            'success' => true,
            'debug_info' => [
                'user_yg_login' => $user->id,
                'email_user'    => $user->email, 
                'semua_denda'   => $semuaDendaUser 
            ],
            'data' => (int) $totalUnpaid, 
        ], 200);
    }
}