<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class GmailController extends Controller
{
    public function redirect(Request $request) {
        $client = $this->getGoogleClient();
        $token = $request->query('token');
        $client->setState($token);
        $url = $client->createAuthUrl();
        return redirect($url);
    }
    public function callback(Request $request) {
        $client = $this->getGoogleClient();
        $token = $client->fetchAccessTokenWithAuthCode($request->code);

        // Récupérer l'user via le state (token Sanctum)
        $sanctumToken = $request->state;
        $tokenRecord = \Laravel\Sanctum\PersonalAccessToken::findToken($sanctumToken);
        
        if (!$tokenRecord) {
            return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/mails?gmail=error&reason=invalid_token');
        }

        $user = $tokenRecord->tokenable;
        $user->update(['gmail_token' => encrypt(json_encode($token))]);

        return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/mails?gmail=connected');
    }

    private function getGoogleClient() {
        $client = new \Google\Client();
        $client->setClientId(config('services.gmail.client_id'));
        $client->setClientSecret(config('services.gmail.client_secret'));
        $client->setRedirectUri(config('services.gmail.redirect_uri'));
        $client->addScope(\Google\Service\Gmail::GMAIL_READONLY);
        $client->setAccessType('offline');
        $client->setPrompt('consent');

        return $client;
    }

    public function mails(Request $request)
    {
        $sanctumToken = $request->bearerToken();
        $tokenRecord = \Laravel\Sanctum\PersonalAccessToken::findToken($sanctumToken);

        if (!$tokenRecord) {
            return response()->json(['error' => 'Non authentifié'], 401);
        }

        $user = $tokenRecord->tokenable;

        if (!$user->gmail_token) {
            return response()->json(['error' => 'Gmail non connecté'], 403);
        }

        $mails = app(\App\Services\GmailService::class)->getRecentMails($user, 5);

        return response()->json($mails);
    }
}