<?php

namespace App\Http\Controllers;

use App\Models\Fine;
use App\Notifications\GeneralNotification;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

use Carbon\Carbon;

use function Symfony\Component\Clock\now;

class PaymentController extends Controller
{
    public function __construct()
    {
        \Midtrans\Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        \Midtrans\Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        \Midtrans\Config::$isSanitized = true;
        \Midtrans\Config::$is3ds = true;
    }

    public function getSnapToken(Request $request, $returnId)
    {
        $user = $request->user();

        $unpaidFines = Fine::where('return_book_id', $returnId)
            ->where('status', 'unpaid')
            ->get();

        if ($unpaidFines->isEmpty()){
            return response()->json([
                'message' => 'No fines need to be paid.'
            ], 400);
        }

        $totalAmount = (int) $unpaidFines->sum('amount');

        if ($totalAmount <= 0) {
            return response()->json([
                'message' => 'Gross amount must be greater than 0.'
            ], 400);
        }

        $orderId = 'FINE-' . $returnId . '-' . time();

        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => $totalAmount,
            ],
            'customer_details' => [
                'first_name' => $user->name,
                'email' => $user->email,
            ],
        ];

        try {
            $snapToken = \Midtrans\Snap::getSnapToken($params);
            return response()->json([
                'token' => $snapToken
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function webhook(Request $request){
        $payload = $request->all();
        $orderId = $payload['order_id'];
        $transactionStatus = $payload['transaction_status'];

        $parts = explode('-', $orderId);
        $returnId = $parts[1] ?? null;

        if ($returnId && in_array($transactionStatus, ['capture', 'settlement'])) 
        {
            $sampleFine = Fine::where('return_book_id', $returnId)->first();
            
            Fine::where('return_book_id', $returnId)
                ->where('status', 'unpaid')
                ->update([
                    'status' => 'paid',
                    'paid_at' => Carbon::now() 
                ]);

            if ($sampleFine && $sampleFine->user) {
                $sampleFine->user->notify(new GeneralNotification(
                    'Payment Received 🎉', 
                    "Thank you! We have successfully verified your fine payment."
                ));
            }
        }

        return response()->json([
            'message' => 'Webhook received'
        ]);
    }
}
