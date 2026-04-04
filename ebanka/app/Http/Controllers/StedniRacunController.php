<?php

namespace App\Http\Controllers;

use App\Models\Transakcija;
use App\Models\StedniRacun;
use Illuminate\Http\Request;
use App\Models\Racun;
use App\Http\Resources\StedniRacunResource;
use Illuminate\Support\Facades\Auth;


class StedniRacunController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validate=$request->validate([
            'user_id'=>'required|exists:users,id',
            'banka_id'=>'required|exists:bankas,id',
            'broj_racuna'=>'required|regex:/^\d{3}-\d{8}-\d{3}$/',
            'stanje_racuna'=>'required|max:100000|min:0',
            'odrzavanje'=>'required|max:500|min:0',
            'kamata'=>'required|max:100|min:0',
            'tip_stednje'=>'required|string|max:255'
        ]);

        $r=Racun::create([
            'user_id'=>$validate['user_id'],
            'banka_id'=>$validate['banka_id'],
            'type'=>'stedni'
        ]);

        $rst=StedniRacun::create([
            'racun_id'=>$r->id,
            'broj_racuna'=>$validate['broj_racuna'],
            'stanje_racuna'=>$validate['stanje_racuna'],
            'odrzavanje'=>$validate['odrzavanje'],
            'kamata'=>$validate['kamata'],
            'tip_stednje'=>$validate['tip_stednje']
        ]);

        $ra2=Racun::findOrFail($r->id);
        if($ra2){
            $ra2->update([
                'id_podtipa'=>$rst->id,
            ]);
        }

        return response()->json(new StedniRacunResource($rst),201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\StedniRacun  $stedniRacun
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user=Auth::user();
        $stedni=StedniRacun::findOrFail($id);
        if($user->id==$stedni->racun->user->id){
            return new StedniRacunResource($stedni);
        }else{
            return response()->json('Nedozvoljen pristup');
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\StedniRacun  $stedniRacun
     * @return \Illuminate\Http\Response
     */
    public function edit(StedniRacun $stedniRacun)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\StedniRacun  $stedniRacun
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, StedniRacun $stedniRacun)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\StedniRacun  $stedniRacun
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $zaBrisanje=StedniRacun::findOrFail($id);
        $glavniRacunZaBrisanje = Racun::findOrFail($zaBrisanje->racun_id);

        Transakcija::where('racun_id', $zaBrisanje->racun_id)->delete();
        $glavniRacunZaBrisanje->delete();
        $zaBrisanje->delete();
        
        return response()->json(['message'=>'Uspesno obrisani racuni iz obe tabele!'],200);
    
    }
}
