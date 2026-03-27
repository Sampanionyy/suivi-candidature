<?php

namespace App\Notifications;

use App\Models\GmailNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewGmailNotification extends Notification
{
    use Queueable;

    public function __construct(
        public GmailNotification $gmailNotification
    ) {}

    public function via(object $notifiable): array
    {
        return ['broadcast', 'database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $application = $this->gmailNotification->applications->first();

        return (new MailMessage)
            ->subject("Nouveau mail : {$this->gmailNotification->subject}")
            ->greeting("Bonjour {$notifiable->name},")
            ->line("Vous avez reçu un nouveau mail lié à votre candidature.")
            ->line("**De :** {$this->gmailNotification->from}")
            ->line("**Objet :** {$this->gmailNotification->subject}")
            ->line("**Aperçu :** {$this->gmailNotification->snippet}")
            ->when($application, fn($mail) => $mail
                ->action('Voir la candidature', config('app.url') . '/applications?highlight=' . $application->id)
                ->line("**Entreprise :** {$application->company}")
                ->line("**Poste :** {$application->position}")
            )
            ->salutation("Cordialement, ApplyTracker");
    }

    public function toDatabase(object $notifiable): array
    {
        $application = $this->gmailNotification->applications->first();

        return [
            'type'                   => 'new_gmail',
            'gmail_notification_id'  => $this->gmailNotification->id,
            'subject'                => $this->gmailNotification->subject,
            'from'                   => $this->gmailNotification->from,
            'snippet'                => $this->gmailNotification->snippet,
            'application_id'         => $application?->id,
            'company'                => $application?->company,
            'position'               => $application?->position,
            'message'                => $this->getMessage(),
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        $application = $this->gmailNotification->applications->first();

        return new BroadcastMessage([
            'type'           => 'new_gmail',
            'message'        => $this->getMessage(),
            'titre'          => $this->gmailNotification->subject,
            'application_id' => $application?->id,
        ]);
    }

    public function toArray(object $notifiable): array
    {
        $application = $this->gmailNotification->applications->first();

        return [
            'message'        => $this->getMessage(),
            'titre'          => $this->gmailNotification->subject,
            'application_id' => $application?->id,
        ];
    }

    private function getMessage(): string
    {
        $application = $this->gmailNotification->applications->first();

        if ($application) {
            return "Nouveau message de {$this->gmailNotification->from} concernant votre candidature chez {$application->company}";
        }

        return "Nouveau message de {$this->gmailNotification->from} : {$this->gmailNotification->subject}";
    }
}