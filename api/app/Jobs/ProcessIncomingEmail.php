<?php

namespace App\Jobs;

use App\Models\GmailNotification;
use App\Notifications\NewGmailNotification;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessIncomingEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public array $mail
    ) {}

    public function handle(): void
    {
        // Éviter les doublons
        if (GmailNotification::where('gmail_message_id', $this->mail['id'])->exists()) {
            return;
        }

        $notification = GmailNotification::create([
            'user_id'          => $this->user->id,
            'gmail_message_id' => $this->mail['id'],
            'subject'          => $this->mail['subject'],
            'from'             => $this->mail['from'],
            'date'             => $this->mail['date'],
            'snippet'          => $this->mail['snippet'],
        ]);

        if ($this->mail['application']) {
            $notification->applications()->attach($this->mail['application']['id']);
        }

        $this->user->notify(new NewGmailNotification($notification));
    }
}