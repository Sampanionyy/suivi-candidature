<?php

namespace App\Console\Commands;

use App\Jobs\ProcessIncomingEmail;
use App\Models\User;
use App\Services\GmailService;
use Illuminate\Console\Command;

class CheckGmailInbox extends Command
{
    protected $signature = 'app:check-gmail-inbox';
    protected $description = 'Récupère les nouveaux mails Gmail et les traite';

    public function handle(GmailService $gmailService)
    {
        $users = User::whereNotNull('gmail_token')->get();
        $count = 0;

        foreach ($users as $user) {
            $mails = $gmailService->getRecentMails($user, 20);

            foreach ($mails as $mail) {
                $count++;
                ProcessIncomingEmail::dispatch($user, $mail);
            }

            $this->info("[{$user->email}] {$count} mails dispatched.");
        }
    }
}