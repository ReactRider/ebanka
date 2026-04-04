<?php

namespace App\Http\Controllers;

use App\Models\TekuciRacun;
use App\Models\Racun;
use App\Models\Transakcija;
use App\Http\Resources\TekuciRacunResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TekuciRacunController extends Controller
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
            'stanje_racuna'=>'required|max:1000000|min:0',
            'odrzavanje'=>'required|max:500|min:0',
            'kamata'=>'required|max:100|min:0',
            'dozvoljeni_minus'=>'required|max:10000|min:0'
        ]);

        $r=Racun::create([
            'user_id'=>$validate['user_id'],
            'banka_id'=>$validate['banka_id'],
            'type'=>'tekuci'
        ]);

        $rt=TekuciRacun::create([
            'racun_id'=>$r->id,
            'broj_racuna'=>$validate['broj_racuna'],
            'stanje_racuna'=>$validate['stanje_racuna'],
            'odrzavanje'=>$validate['odrzavanje'],
            'kamata'=>$validate['kamata'],
            'dozvoljeni_minus'=>$validate['dozvoljeni_minus']
        ]);

        $rac2=Racun::findOrFail($r->id);
        if($rac2){
            $rac2->update([
                'id_podtipa'=>$rt->id,
            ]);
        }

        return response()->json(new TekuciRacunResource($rt),201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\TekuciRacun  $tekuciRacun
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user=Auth::user();
        $tekuci=TekuciRacun::findOrFail($id);
        if($user->id==$tekuci->racun->user->id){
            return new TekuciRacunResource($tekuci);
        }else{
            return response()->json('Nedozvoljen pristup');
        }
        
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\TekuciRacun  $tekuciRacun
     * @return \Illuminate\Http\Response
     */
    public function edit(TekuciRacun $tekuciRacun)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TekuciRacun  $tekuciRacun
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $tekuci=TekuciRacun::findOrFail($id);
        $validate=$request->validate([
            'iznos'=>'required',
        ]);

        $tekuci->stanje_racuna -= $validate['iznos'];
        $tekuci->save();

        return response()->json(['Uspesno izmenjeno  stanje racuna'],200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TekuciRacun  $tekuciRacun
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $zaBrisanje=TekuciRacun::findOrFail($id);
        $glavniRacunZaBrisanje = Racun::findOrFail($zaBrisanje->racun_id);

        Transakcija::where('racun_id', $zaBrisanje->racun_id)->delete();
        $glavniRacunZaBrisanje->delete();
        $zaBrisanje->delete();
        
        return response()->json(['message'=>'Uspesno obrisani racuni iz obe tabele!'],200);
    }

    public function changeBalance(Request $request, $broj_racuna, $novo_stanje) {
        $tekuci = TekuciRacun::where('broj_racuna', $broj_racuna)->first();

        if(!$tekuci)
            return response()->json('greska pri promeni tekuceg racuna. tekuci racun nije pronadjen!', 404);

        $tekuci->stanje_racuna = $novo_stanje;
        
        $tekuci->save();

        return response()->json(['poruka' => 'Stanje tekuceg racuna promenjeno!'],200);
    }

    public function promena_stanja(Request $request, $id)
    {
        $tekuci=TekuciRacun::findOrFail($id);
        $validate=$request->validate([
            'iznos'=>'required',
        ]);

        $tekuci->stanje_racuna += $validate['iznos'];
        $tekuci->save();

        return response()->json(['Uspesno izmenjeno stanje racuna'],200);
    }
   
}
