<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Model
{
    use HasFactory, HasApiTokens, Notifiable;

    protected $fillable = [
        'ime',
        'prezime',
        'broj_legitimacije',
        'datum_rođenja',
        'grad',
        'email',
        'password',
        'otp_code',
        'otp_expires_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'otp_expires_at' => 'datetime',
    ];

    public function banka() {
        return $this->belongsTo(Banka::class);
    }

    public $timestamps = false;
}
