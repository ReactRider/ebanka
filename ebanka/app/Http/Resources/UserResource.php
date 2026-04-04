<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public static $wrap = 'users';
    public function toArray($request)
    {
        return [
            'id'=>$this->resource->id,
            'ime'=>$this->resource->ime,
            'prezime'=>$this->resource->prezime,
            'maticni_broj'=>$this->resource->maticni_broj,
            'broj_licne_karte'=>$this->resource->broj_licne_karte,
            'datum_rođenja'=>$this->resource->datum_rođenja,
            'email'=>$this->resource->email,
            'adresa'=>$this->resource->adresa,
            'grad'=>$this->resource->grad,
            'drzava'=>$this->resource->drzava,
            'broj_telefona'=>$this->resource->broj_telefona
        ];
        
        
        //return parent::toArray($request);
    }
}
