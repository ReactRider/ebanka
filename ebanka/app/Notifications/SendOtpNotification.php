<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendOtpNotification extends Notification
{
    use Queueable;

    public function __construct(private string $otp) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('eBanka — Vaš verifikacioni kod')
            ->greeting('Poštovani,')
            ->line('Primili ste ovaj email jer je neko pokušao da se prijavi na vaš eBanka nalog.')
            ->line('Vaš jednokratni verifikacioni kod je:')
            ->line('## ' . $this->otp)
            ->line('Kod je važeći narednih **10 minuta**.')
            ->line('Ako niste vi inicirali ovu prijavu, odmah promenite lozinku.')
            ->salutation('eBanka tim');
    }
}
