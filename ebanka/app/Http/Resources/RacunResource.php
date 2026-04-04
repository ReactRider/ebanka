<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\BankaResource;
use App\Models\Racun;
use App\Models\TekuciRacun;
use App\Models\StudentskiRacun;
use App\Models\DevizniRacun;
use App\Models\StedniRacun;
use App\Http\Resources\TekuciRacunResource;
use App\Http\Resources\StudentskiRacunResource;
use App\Http\Resources\DevizniRacunResource;
use App\Http\Resources\StedniRacunResource;
use App\Http\Controllers\Controller;

class RacunResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public static $wrap='racun';
   
    public function toArray($request)
    {
        //return parent::toArray($request);
        
        $myController=new Controller();


        return [

            'id'=>$this->resource->id,
            'tip'=>$this->resource->type,
            'user'=>new UserResource($this->resource->user),
            'banka'=>new BankaResource($this->resource->banka),
            'detalji'=>$myController->pronadji_podtip($this->resource->id_podtipa,$this->resource->type),
        ];

        /*$tekuci=null;
        $stedni=null;
        $devizni=null;
        $studentki=null;

        if($this->resource->type=='tekuci'){
            $tekuci=TekuciRacun::where('racun_id',$this->resource->id)->first();    
        }
        if($this->resource->type=='stedni'){
            $stedni=StedniRacun::where('racun_id',$this->resource->id)->first();
        }
        if($this->resource->type=='devizni'){
            $devizni=DevizniRacun::where('racun_id',$this->resource->id)->first();
        }
        if($this->resource->type=='studentski'){
            $studentski=StudentskiRacun::where('racun_id',$this->resource->id)->first();
        }

        if(isset($tekuci)){

            return [

                'id'=>$this->resource->id,
                'tip'=>$this->resource->type,
                'user'=>new UserResource($this->resource->user),
                'banka'=>new BankaResource($this->resource->banka),
                'detalji'=>new TekuciRacunResource($tekuci),
             
            ];
        }
        if(isset($devizni)){

            return [

                'id'=>$this->resource->id,
                'tip'=>$this->resource->type,
                'user'=>new UserResource($this->resource->user),
                'banka'=>new BankaResource($this->resource->banka),
                'detalji'=>new DevizniRacunResource($devizni)
            ];
        }
        if(isset($stedni)){

            return [

                'id'=>$this->resource->id,
                'tip'=>$this->resource->type,
                'user'=>new UserResource($this->resource->user),
                'banka'=>new BankaResource($this->resource->banka),
                'detalji'=>new StedniRacunResource($stedni)
            ];
        }
        if(isset($studentki)){

            return [

                'id'=>$this->resource->id,
                'tip'=>$this->resource->type,
                'user'=>new UserResource($this->resource->user),
                'banka'=>new BankaResource($this->resource->banka),
                'detalji'=>new StudentskiRacunResource($studentski)
            ];
        }*/
    }
}
