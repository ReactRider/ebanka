<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\BankaResource;

class AdminResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public static $wrap = 'admins';
    public function toArray($request)
    {
        return [
            'id'=>$this->resource->id,
            'ime'=>$this->resource->ime,
            'prezime'=>$this->resource->prezime,
            'datum_rođenja'=>$this->resource->datum_rođenja,
            'email'=>$this->resource->email,
            'grad'=>$this->resource->grad,
            'role'=>$this->resource->role,
            'broj_legitimacije'=>$this->resource->broj_legitimacije,
            'banka_id' =>new BankaResource($this->resource->banka)
        ];
    }
}
