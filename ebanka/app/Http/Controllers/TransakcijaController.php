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
            if ($sledece->lt($today)) {
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

        // Za eksterne transakcije ka internom racunu, kreditiraj primaoca
        // (za interne transakcije frontend vec kreditira primaoca direktno)
        if ($request->input('tip') !== 'interna') {
            $this->kreditirajPrimaoca($validate['broj_racuna_primaoca'], (float) $validate['iznos']);
        }

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

    private function kreditirajPrimaoca(string $brojRacuna, float $iznos): void
    {
        $modeli = [
            TekuciRacun::class,
            StudentskiRacun::class,
            StedniRacun::class,
            DevizniRacun::class,
        ];

        foreach ($modeli as $model) {
            $podracun = $model::where('broj_racuna', $brojRacuna)->first();
            if ($podracun) {
                $podracun->stanje_racuna += $iznos;
                $podracun->save();
                return;
            }
        }
    }

    // DODATO: vraca sve izvrsene zakazane transakcije za danasnji dan za racune ulogovanog korisnika
    public function noveIzvrseneZakazane(Request $request)
    {
        $user  = $request->user();
        $today = Carbon::today()->toDateString();

        $racunIds = Racun::where('user_id', $user->id)->pluck('id');

        if ($racunIds->isEmpty()) {
            return response()->json(['transakcije' => []]);
        }

        $transakcije = Transakcija::whereIn('racun_id', $racunIds)
            ->where('was_scheduled', true)
            ->where('datum', $today)
            ->get(['id', 'iznos', 'naziv_primaoca', 'broj_racuna_primaoca', 'vreme']);

        return response()->json(['transakcije' => $transakcije]);
    }

    // DODATO: vraca dolazne transakcije za sve racune ulogovanog korisnika nastale nakon datog trenutka
    public function dolazneTransakcije(Request $request)
    {
        $user = $request->user();
        $od   = $request->query('od');

        $racuni = Racun::where('user_id', $user->id)->get();
        $brojeviRacuna = [];

        foreach ($racuni as $racun) {
            $podracun = match($racun->type) {
                'tekuci'     => TekuciRacun::find($racun->id_podtipa),
                'studentski' => StudentskiRacun::find($racun->id_podtipa),
                'stedni'     => StedniRacun::find($racun->id_podtipa),
                'devizni'    => DevizniRacun::find($racun->id_podtipa),
                default      => null,
            };
            if ($podracun) {
                $brojeviRacuna[] = $podracun->broj_racuna;
            }
        }

        if (empty($brojeviRacuna)) {
            return response()->json(['transakcije' => []]);
        }

        $transakcije = Transakcija::whereIn('broj_racuna_primaoca', $brojeviRacuna)
            ->where(function ($q) {
                $q->where('is_scheduled', false)->orWhereNull('is_scheduled');
            })
            ->whereRaw("CONCAT(datum, ' ', vreme) > ?", [$od])
            ->get(['iznos', 'broj_racuna_primaoca', 'datum', 'vreme']);

        return response()->json(['transakcije' => $transakcije]);
    }
}
