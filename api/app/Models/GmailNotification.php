<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class GmailNotification extends Model
{
    protected $fillable = ['user_id', 'gmail_message_id', 'subject', 'from', 'date', 'snippet', 'read'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function applications()
    {
        return $this->belongsToMany(Application::class);
    }

    public function gmailNotifications(): BelongsToMany
    {
        return $this->belongsToMany(GmailNotification::class);
    }
}
