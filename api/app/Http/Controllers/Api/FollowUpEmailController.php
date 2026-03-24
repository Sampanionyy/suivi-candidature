<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\FollowUpEmailMailable;
use App\Models\Application;
use App\Models\FollowUpEmail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class FollowUpEmailController extends Controller
{
    public function index(Application $application): JsonResponse
    {
        $this->authorizeApplication($application);

        $emails = $application->followUpEmails()
            ->orderBy('sent_at', 'desc')
            ->get();

        return response()->json($emails);
    }

    public function store(Request $request, Application $application): JsonResponse
    {
        $this->authorizeApplication($application);

        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'body'    => 'required|string',
        ]);

        $recipient = $application->contact_email;

        if (! $recipient) {
            return response()->json([
                'message' => 'Aucune adresse email de contact renseignée pour cette candidature.',
            ], 422);
        }

        Mail::to($recipient)->send(
            new FollowUpEmailMailable($validated['subject'], $validated['body'])
        );

        $email = FollowUpEmail::create([
            'application_id' => $application->id,
            'user_id'        => $request->user()->id,
            'subject'        => $validated['subject'],
            'body'           => $validated['body'],
            'sent_at'        => now(),
        ]);

        return response()->json($email, 201);
    }

    private function authorizeApplication(Application $application): void
    {
        if ((int) $application->user_id !== (int) auth()->id()) {
            abort(403, 'Accès non autorisé à cette candidature.');
        }
    }
}