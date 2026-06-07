<?php

namespace App\Http\Controllers;

use App\Models\Transakcija;
use Illuminate\Http\Request;
use App\Models\Racun;
use App\Models\StudentskiRacun;
use App\Models\DevizniRacun;
use App\Models\StedniRacun;
use App\Models\TekuciRacun;

use App\Http\Resources\TransakcijaCollection;
use App\Http\Resources\TransakcijaResource;
use Carbon\Carbon; // DODATO: za racunanje sledece_izvrsavanje kod zakazanih transakcija

class TransakcijaController extends Controller
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
        // DODATO: provera da li je transakcija zakazana (recurring templat)
        $isScheduled = $request->boolean('is_scheduled');

        $validate = $request->validate([
            'iznos'                => 'required',
            'datum'                => 'required',
            'vreme'                => 'required',
            'opis_transakcije'     => 'required',
            'broj_racuna_primaoca' => 'required',
            'racun_id'             => 'required',
            'sifra_placanja'       => 'required',
            'naziv_primaoca'       => 'required',
            // DODATO: dan_u_mesecu je obavezan samo za zakazane transakcije
            'dan_u_mesecu'         => 'required_if:is_scheduled,true|nullable|integer|min:1|max:28',
        ]);

        if ($isScheduled) {
            // DODATO: racunanje prvog datuma izvrsavanja na osnovu dana u mesecu
            $dan   = (int) $validate['dan_u_mesecu'];
            $today = Carbon::today();
            $sledece = Carbon::createFromDate($today->year, $today->month, $dan);
            if ($sledece->lte($today)) {
                $sledece->addMonth();
            }

            $transakcija = Transakcija::create([
                'iznos'                => $validate['iznos'],
                'datum'                => $validate['datum'],
                'vreme'                => $validate['vreme'],
                'opis_transakcije'     => $validate['opis_transakcije'],
                'broj_racuna_primaoca' => $validate['broj_racuna_primaoca'],
                'sifra_placanja'       => $validate['sifra_placanja'],
                'naziv_primaoca'       => $validate['naziv_primaoca'],
                'racun_id'             => $validate['racun_id'],
                'id'                   => rand(100000000000000, 999999999999999),
                // DODATO: polja zakazane transakcije
                'is_scheduled'         => true,
                'dan_u_mesecu'         => $dan,
                'sledece_izvrsavanje'  => $sledece->toDateString(),
                'is_active'            => true,
            ]);

            return response()->json(new TransakcijaResource($transakcija), 201);
        }

        // Postojeca logika za obicne transakcije (nepromenjena)
        $transakcija = Transakcija::create([
            'iznos'                => $validate['iznos'],
            'datum'                => $validate['datum'],
            'vreme'                => $validate['vreme'],
            'opis_transakcije'     => $validate['opis_transakcije'],
            'broj_racuna_primaoca' => $validate['broj_racuna_primaoca'],
            'sifra_placanja'       => $validate['sifra_placanja'],
            'naziv_primaoca'       => $validate['naziv_primaoca'],
            'racun_id'             => $validate['racun_id'],
            'id'                   => rand(100000000000000, 999999999999999),
        ]);

        return response()->json(new TransakcijaResource($transakcija), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Transakcija  $transakcija
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $trans=Transakcija::findOrFail($id);
        return new TransakcijaResource($trans);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Transakcija  $transakcija
     * @return \Illuminate\Http\Response
     */
    public function edit(Transakcija $transakcija)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Transakcija  $transakcija
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Transakcija $transakcija)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Transakcija  $transakcija
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {   
        $array = $request->input('acc_id');

        foreach($array as $elem) {
            $racun = Racun::find($elem);

            switch($racun->type) {
                case 'tekuci':
                    TekuciRacun::where('id', $racun->id_podtipa)->delete();
                    break;
                case 'studentski':
                    StudentskiRacun::where('id', $racun->id_podtipa)->delete();
                    break;
                case 'stedni':
                    StedniRacun::where('id', $racun->id_podtipa)->delete();
                    break;
                case 'devizni':
                    DevizniRacun::where('id', $racun->id_podtipa)->delete();
                    break;
                default:
                    return "Nepoznat tip racuna!";
            }
            $racun->delete();
        }

        // brisanje svih transakcija svakog racuna koji je prosledjen
        foreach($array as $elem) {
            Transakcija::where('racun_id', $elem)->delete();
        }
     
    return response()->json(["message" => "Svi zahtevani racuni su obrisani. Sve transakcije datih racuna su obrisane."]);
}

    public function prikaz_transakcija($racun_id){
        $racun = Racun::findOrFail($racun_id);
        // DODATO: iskljucujemo templejte zakazanih transakcija iz istorije
        $t = $racun->transakcija()->obicne()->get();
        return new TransakcijaCollection($t);
    }

    // DODATO: vraca sve aktivne zakazane transakcije za dati racun
    public function zakazane_transakcije($racun_id){
        $racun = Racun::findOrFail($racun_id);
        $t = $racun->transakcija()->zakazane()->get();
        return response()->json(['zakazane_transakcije' => $t]);
    }

    // DODATO: deaktivira zakazanu transakciju (korisnik je otkazuje)
    public function deaktiviraj($id){
        $transakcija = Transakcija::findOrFail($id);
        $transakcija->update(['is_active' => false]);
        return response()->json(['message' => 'Zakazana transakcija je otkazana.']);
    }
}
