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

    public function getRecentMails(User $user, int $limit = 5): array
    {
        $client = $this->buildClient($user);
        $gmail = new Gmail($client);

        $messages = $gmail->users_messages->listUsersMessages('me', [
            'maxResults' => $limit,
            'labelIds'   => ['INBOX'],
        ]);

        $result = [];

        foreach ($messages->getMessages() ?? [] as $msg) {
            $full = $gmail->users_messages->get('me', $msg->getId(), [
                'format'          => 'metadata',
                'metadataHeaders' => ['From', 'Subject', 'Date'],
            ]);

            $headers = collect($full->getPayload()->getHeaders())
                ->keyBy('name');

            $result[] = [
                'id'      => $msg->getId(),
                'subject' => $headers->get('Subject')?->getValue() ?? '(sans objet)',
                'from'    => $headers->get('From')?->getValue() ?? '',
                'date'    => $headers->get('Date')?->getValue() ?? '',
                'snippet' => $full->getSnippet(),
            ];
        }

        return $result;
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