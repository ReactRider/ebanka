<?php

namespace App\Http\Controllers;

use App\Models\DevizniRacun;
use App\Models\Transakcija;
use Illuminate\Http\Request;
use App\Models\Racun;
use App\Http\Resources\DevizniRacunResource;
use Illuminate\Support\Facades\Auth;

class DevizniRacunController extends Controller
{
    
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
            'valuta'=>'required|string|max:3'
            
        ]);

        $r=Racun::create([
            'user_id'=>$validate['user_id'],
            'banka_id'=>$validate['banka_id'],
            'type'=>'devizni'
        ]);

        $rd=DevizniRacun::create([
            'racun_id'=>$r->id,
            'broj_racuna'=>$validate['broj_racuna'],
            'stanje_racuna'=>$validate['stanje_racuna'],
            'odrzavanje'=>$validate['odrzavanje'],
            'valuta'=>$validate['valuta']
        ]);

        $racun2=Racun::findOrFail($r->id);
        if($racun2){
            $racun2->update([
                'id_podtipa'=>$rd->id,
            ]);
        }

        return response()->json(new DevizniRacunResource($rd),201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\DevizniRacun  $devizniRacun
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user=Auth::user();
        $devizni=DevizniRacun::findOrFail($id);
        if($user->id==$devizni->racun->user->id){
            return new DevizniRacunResource($devizni);
        }else{
            return response()->json('Nedozvoljen pristup');
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\DevizniRacun  $devizniRacun
     * @return \Illuminate\Http\Response
     */
    public function edit(DevizniRacun $devizniRacun)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\DevizniRacun  $devizniRacun
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $devizni=DevizniRacun::findOrFail($id);
        $validated=$request->validate([
            'iznos'=>'required',
        ]);

        $devizni->stanje_racuna -= $validated['iznos'];
        $devizni->save();

        return response()->json(['Uspesno izmenjeno  stanje racuna'],200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\DevizniRacun  $devizniRacun
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $zaBrisanje=DevizniRacun::findOrFail($id);
        $glavniRacunZaBrisanje = Racun::findOrFail($zaBrisanje->racun_id);

        Transakcija::where('racun_id', $zaBrisanje->racun_id)->delete();
        $glavniRacunZaBrisanje->delete();
        $zaBrisanje->delete();
        
        return response()->json(['message'=>'Uspesno obrisani racuni iz obe tabele!'],200);
    }

    public function changeBalance(Request $request, $broj_racuna, $novo_stanje) {
        $devizni = DevizniRacun::where('broj_racuna', $broj_racuna)->first();

        if(!$devizni)
            return response()->json('greska pri promeni deviznog racuna. devizni racun nije pronadjen!', 404);

        $devizni->stanje_racuna = $novo_stanje;
        
        $devizni->save();

        return response()->json(['poruka' => 'Stanje deviznog racuna promenjeno!'],200);
    }

    public function promena_stanja(Request $request, $id)
    {
        $devizni=DevizniRacun::findOrFail($id);
        $validated=$request->validate([
            'iznos'=>'required',
        ]);

        $devizni->stanje_racuna += $validated['iznos'];
        $devizni->save();

        return response()->json(['Uspesno izmenjeno  stanje racuna'],200);
    }
}
