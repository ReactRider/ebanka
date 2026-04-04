<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Racun;

class TekuciRacun extends Model
{
    use HasFactory;

    protected $guarded = [];

   /* public function account() {
        return 
        $this->morphOne(Racun::class, 'racunTip');
    }*/

    public function racun(){
        return $this->belongsTo(Racun::class);
    }

}
