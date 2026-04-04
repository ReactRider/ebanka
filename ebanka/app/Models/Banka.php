<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banka extends Model
{
    use HasFactory;
    
    protected $fillable = ['naziv', 'grad', 'broj_dozvole'];

    public function racun(){
        return $this->hasMany(Racun::class);
    }

    public function user(){
        return $this->hasMany(User::class);
    }

    public function admin(){
        return $this->belongsTo(Admin::class);
    }

    public $timestamps = false;
}