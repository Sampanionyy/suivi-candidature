<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\ApplicationNote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicationNoteController extends Controller
{
    public function index(Application $application): JsonResponse
    {
        $this->authorizeApplication($application);

        $notes = $application->notes()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notes);
    }

    public function store(Request $request, Application $application): JsonResponse
    {
        $this->authorizeApplication($application);

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $note = ApplicationNote::create([
            'application_id' => $application->id,
            'user_id'        => $request->user()->id,
            'content'        => $validated['content'],
        ]);

        return response()->json($note, 201);
    }

    public function destroy(Application $application, ApplicationNote $note): JsonResponse
    {
        $this->authorizeApplication($application);

        if ((int) $note->application_id !== (int) $application->id) {
            return response()->json(['message' => 'Cette note n\'appartient pas à cette candidature.'], 403);
        }

        $note->delete();

        return response()->json(null, 204);
    }

    private function authorizeApplication(Application $application): void
    {
        if ((int) $application->user_id !== (int) auth()->id()) {
            abort(403, 'Accès non autorisé à cette candidature.');
        }
    }
}