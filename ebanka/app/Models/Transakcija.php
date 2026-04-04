<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transakcija extends Model
{
    use HasFactory;
    public $timestamps=false;
    protected $fillable = ['broj_racuna_primaoca', 'iznos', 'opis_transakcije','datum','vreme','id','racun_id','sifra_placanja', 'naziv_primaoca'];
    

    public function racun(){
        return $this->belongsTo(Racun::class);
    }
}
