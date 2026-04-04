<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TekuciRacun;
use App\Models\StedniRacun;
use App\Models\DevizniRacun;
use App\Models\StudentskiRacun;

class Racun extends Model
{
    use HasFactory;

    protected $guarded=[];

    public function banka(){
        return $this->belongsTo(Banka::class);
    }

    public function transakcija(){
        return $this->hasMany(Transakcija::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
