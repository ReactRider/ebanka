<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transakcija extends Model
{
    use HasFactory;
    public $timestamps=false;

    // DODATO: is_scheduled, dan_u_mesecu, sledece_izvrsavanje, is_active za zakazane transakcije
    protected $fillable = [
        'broj_racuna_primaoca', 'iznos', 'opis_transakcije', 'datum', 'vreme',
        'id', 'racun_id', 'sifra_placanja', 'naziv_primaoca',
        'is_scheduled', 'dan_u_mesecu', 'sledece_izvrsavanje', 'is_active', 'was_scheduled',
    ];

    public function racun(){
        return $this->belongsTo(Racun::class);
    }

    // DODATO: scope koji vraca samo zakazane (templat) transakcije
    public function scopeZakazane($query){
        return $query->where('is_scheduled', true)->where('is_active', true);
    }

    // DODATO: scope koji vraca samo obicne (izvrsene) transakcije, iskljucuje templejte
    public function scopeObicne($query){
        return $query->where(function($q){
            $q->where('is_scheduled', false)->orWhereNull('is_scheduled');
        });
    }
}
