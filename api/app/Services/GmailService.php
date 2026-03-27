<?php

namespace App\Services;

use App\Models\User;
use Google\Client;
use Google\Service\Gmail;

class GmailService
{
    public function buildClient(User $user): Client
    {
        $client = $this->getBaseClient();
        $token = json_decode(decrypt($user->gmail_token), true);
        $client->setAccessToken($token);

        if ($client->isAccessTokenExpired()) {
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
            $user->update(['gmail_token' => encrypt(json_encode($client->getAccessToken()))]);
        }

        return $client;
    }

    public function getRecentMails(User $user, int $limit = 20): array
    {
        $client = $this->buildClient($user);
        $gmail = new Gmail($client);

        // Récupérer toutes les entreprises + emails de contact de l'user
        $applications = $user->applications()
            ->whereNotNull('company')
            ->get(['company', 'contact_email']);

        // Construire la query Gmail : "from:entreprise OR subject:entreprise ..."
        $queryParts = [];
        foreach ($applications as $app) {
            $company = strtolower(trim($app->company));
            if ($company) {
                $queryParts[] = 'subject:"' . $company . '"';
                $queryParts[] = 'from:"' . $company . '"';
            }
            if ($app->contact_email) {
                $domain = substr(strrchr($app->contact_email, '@'), 1);
                $queryParts[] = 'from:' . $domain;
            }
        }

        if (empty($queryParts)) {
            return [];
        }

        $query = implode(' OR ', $queryParts);

        $messages = $gmail->users_messages->listUsersMessages('me', [
            'q'          => $query,
            'maxResults' => $limit,
        ]);

        $result = [];

        foreach ($messages->getMessages() ?? [] as $msg) {
            $full = $gmail->users_messages->get('me', $msg->getId(), [
                'format'          => 'metadata',
                'metadataHeaders' => ['From', 'Subject', 'Date'],
            ]);

            $headers = collect($full->getPayload()->getHeaders())->keyBy('name');
            $from    = $headers->get('From')?->getValue() ?? '';
            $subject = $headers->get('Subject')?->getValue() ?? '(sans objet)';

            if (str_contains(strtolower($from), 'applytrack')) {
                continue;
            }

            // Trouver la candidature correspondante
            $matchedApp = $this->matchApplication($applications, $from, $subject);

            $result[] = [
                'id'          => $msg->getId(),
                'subject'     => $subject,
                'from'        => $from,
                'date'        => $headers->get('Date')?->getValue() ?? '',
                'snippet'     => $full->getSnippet(),
                'application' => $matchedApp ? [
                    'id'      => $matchedApp->id,
                    'company' => $matchedApp->company,
                    'position'=> $matchedApp->position,
                    'status'  => $matchedApp->status,
                ] : null,
            ];
        }

        return $result;
    }

    private function matchApplication($applications, string $from, string $subject): mixed
    {
        $fromLower    = strtolower($from);
        $subjectLower = strtolower($subject);

        foreach ($applications as $app) {
            $company = strtolower(trim($app->company));

            if (str_contains($fromLower, $company) || str_contains($subjectLower, $company)) {
                return $app;
            }

            if ($app->contact_email) {
                $domain = strtolower(substr(strrchr($app->contact_email, '@'), 1));
                if ($domain && str_contains($fromLower, $domain)) {
                    return $app;
                }
            }
        }

        return null;
    }

    private function getBaseClient(): Client
    {
        $client = new Client();
        $client->setClientId(config('services.gmail.client_id'));
        $client->setClientSecret(config('services.gmail.client_secret'));
        $client->setRedirectUri(config('services.gmail.redirect_uri'));
        $client->addScope(Gmail::GMAIL_READONLY);
        $client->setAccessType('offline');
        return $client;
    }
}