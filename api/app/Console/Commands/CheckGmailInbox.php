<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CheckGmailInbox extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-gmail-inbox';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        foreach (User::whereNotNull('gmail_token')->get() as $user) {
            $client = $this->buildClient($user);
            $gmail = new \Google\Service\Gmail($client);

            $messages = $gmail->users_messages->listUsersMessages('me', [
                'q' => 'is:unread newer_than:1d',
                'maxResults' => 20,
            ]);

            foreach ($messages->getMessages() ?? [] as $msg) {
                $full = $gmail->users_messages->get('me', $msg->getId(), [
                    'format' => 'metadata',
                    'metadataHeaders' => ['From', 'Subject', 'Date'],
                ]);
                ProcessIncomingEmail::dispatch($user, $full);
            }
        }
    }

    private function buildClient(User $user): \Google\Client {
        $client = $this->getGoogleClient();
        $token = json_decode(decrypt($user->gmail_token), true);
        $client->setAccessToken($token);

        if ($client->isAccessTokenExpired()) {
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
            $user->update(['gmail_token' => encrypt(
                json_encode($client->getAccessToken())
            )]);
        }
        return $client;
    }
}
