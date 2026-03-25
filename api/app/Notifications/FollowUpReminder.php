<?php

namespace App\Notifications;

use App\Models\Application;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FollowUpReminder extends Notification
{
    use Queueable;

    public function __construct(
        public Application $application
    ) {}

    public function via(object $notifiable): array
    {
        return ['broadcast', 'database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $days     = $this->getDaysSinceLastContact();
        $company  = $this->application->company;
        $position = $this->application->position;
        $isFirst  = $this->application->follow_up_count === 0;

        $subject = $isFirst
            ? "Relance recommandée : {$position} chez {$company}"
            : "Nouvelle relance conseillée : {$position} chez {$company}";

        $intro = $isFirst
            ? "Vous avez postulé il y a **{$days} jours** pour le poste de **{$position}** chez **{$company}** et n'avez pas encore reçu de réponse."
            : "Cela fait **{$days} jours** depuis votre dernière relance pour le poste de **{$position}** chez **{$company}**.";

        $appUrl = config('app.url') . '/applications?highlight=' . $this->application->id;

        return (new MailMessage)
            ->subject($subject)
            ->greeting("Bonjour {$notifiable->name},")
            ->line($intro)
            ->line("Il est conseillé d'envoyer un message de suivi afin de maintenir votre candidature active.")
            ->action('Voir la candidature', $appUrl)
            ->line("---")
            ->line("**Récapitulatif de la candidature**")
            ->line("Poste : {$position}")
            ->line("Entreprise : {$company}")
            ->line("Date de candidature : " . Carbon::parse($this->application->applied_date)->format('d/m/Y'))
            ->line("Nombre de relances effectuées : {$this->application->follow_up_count}")
            ->salutation("Cordialement, ApplyTracker");
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type'                    => 'follow_up_reminder',
            'application_id'          => $this->application->id,
            'position'                => $this->application->position,
            'company'                 => $this->application->company,
            'applied_date'            => $this->application->applied_date,
            'last_follow_up_date'     => $this->application->last_follow_up_date,
            'follow_up_count'         => $this->application->follow_up_count,
            'days_since_last_contact' => $this->getDaysSinceLastContact(),
            'message'                 => $this->getMessage(),
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message'        => $this->getMessage(),
            'titre'          => $this->application->position,
            'application_id' => $this->application->id,
        ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message'        => $this->getMessage(),
            'titre'          => $this->application->position,
            'application_id' => $this->application->id,
        ];
    }

    private function getDaysSinceLastContact(): int
    {
        $lastContactDate = $this->application->last_follow_up_date
            ?? $this->application->applied_date;

        return (int) abs(now()->diffInDays($lastContactDate));
    }

    private function getMessage(): string
    {
        $days     = $this->getDaysSinceLastContact();
        $company  = $this->application->company;
        $position = $this->application->position;

        if ($this->application->follow_up_count === 0) {
            return "Il est temps de relancer {$company} pour le poste de {$position} (candidature envoyée il y a {$days} jours)";
        }

        return "Nouvelle relance recommandée pour {$company} - {$position} ({$days} jours depuis la dernière relance)";
    }
}