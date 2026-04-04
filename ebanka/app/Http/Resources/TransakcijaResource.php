<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TransakcijaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */

    public static $wrap='transakcija';
    public function toArray($request)
    {
        //return parent::toArray($request);
        return [
            'id'=>$this->resource->id,
            'iznos'=>$this->resource->iznos,
            'posiljaoc'=>new RacunResource($this->resource->racun),
            'broj_racuna_primaoca'=>$this->resource->broj_racuna_primaoca,
            'datum'=>$this->resource->datum,
            'vreme'=>$this->resource->vreme,
            'opis_transakcije'=>$this->resource->opis_transakcije,
            'sifra_placanja'=>$this->resource->sifra_placanja,
            'naziv_primaoca'=>$this->resource->naziv_primaoca
        ];
    }
}
