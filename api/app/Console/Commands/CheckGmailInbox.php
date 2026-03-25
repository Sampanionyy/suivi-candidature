<?php

namespace App\Console\Commands;
use App\Services\GmailService;

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
    public function handle(GmailService $gmailService)
    {
        foreach (User::whereNotNull('gmail_token')->get() as $user) {
            $mails = $gmailService->getRecentMails($user, 20);
            foreach ($mails as $mail) {
                ProcessIncomingEmail::dispatch($user, $mail);
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
