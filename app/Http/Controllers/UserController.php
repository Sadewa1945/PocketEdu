<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function profile(Request $request){
        $user = $request->user()
            ->load('classes.major')
            ->loadCount('borrowingsUser');

        return response()->json([
            'success' => true,
            'message' => 'This is the user profile endpoint',
            'data' => $user
        ], 200);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->filled('name')) {
            $user->name = $validated['name'];
        }

        if ($request->hasFile('image')) {
            if ($user->image && Storage::disk('public')->exists($user->image)) {
                Storage::disk('public')->delete($user->image);
            }

            $path = $request->file('image')->store('users', 'public');
            $user->image = $path;
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $user
        ], 200);
    }
}
