<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\RacunResource;

class DevizniRacunResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */

    public static $wrap='devizni_racun';
    public function toArray($request)
    {
        //return parent::toArray($request);
        return [
            'id'=>$this->resource->id,
            'broj_racuna'=>$this->resource->broj_racuna,
            'stanje_racuna'=>$this->resource->stanje_racuna,
            'valuta'=>$this->resource->valuta,
            'odrzavanje'=>$this->resource->odrzavanje,
            'racun'=> new RacunResource($this->resource->racun),
            //'racun' => $this->whenLoaded('racun'),  

        ];
    }
}
