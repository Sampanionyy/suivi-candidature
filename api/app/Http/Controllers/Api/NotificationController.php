<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => auth()->user()->notifications()->paginate(20),
        ]);
    }

    public function unread(): JsonResponse
    {
        $unread = auth()->user()->unreadNotifications;

        return response()->json([
            'success' => true,
            'count'   => $unread->count(),
            'data'    => $unread,
        ]);
    }

    public function markAsRead(string $id): JsonResponse
    {
        $notification = auth()->user()->notifications()->find($id);

        if (! $notification) {
            return response()->json(['success' => false, 'message' => 'Notification introuvable.'], 404);
        }

        $notification->markAsRead();

        return response()->json(['success' => true]);
    }

    public function markAllAsRead(): JsonResponse
    {
        auth()->user()->unreadNotifications->markAsRead();

        return response()->json(['success' => true]);
    }
}