<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Transakcija;
use App\Models\Racun;
use App\Models\TekuciRacun;
use App\Models\StudentskiRacun;
use App\Models\StedniRacun;
use App\Models\DevizniRacun;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

// DODATO: Artisan komanda koja se izvrsava svaki dan u ponoc.
// Prolazi kroz sve aktivne zakazane transakcije ciji je datum izvrsavanja danas ili pre,
// kreira stvarnu transakciju, odbija iznos sa racuna posiljoca,
// i pomera sledece_izvrsavanje za mesec dana.
class IzvrsiZakazaneTransakcije extends Command
{
    protected $signature = 'transakcije:izvrsi-zakazane';
    protected $description = 'Izvrsava sve zakazane (recurring) transakcije ciji je datum dosao.';

    public function handle()
    {
        $today = Carbon::today();

        // Dohvati sve aktivne zakazane transakcije kojima je dosao datum
        $zakazane = Transakcija::where('is_scheduled', true)
            ->where('is_active', true)
            ->whereDate('sledece_izvrsavanje', '<=', $today)
            ->get();

        $this->info("Pronadjeno {$zakazane->count()} zakazanih transakcija za izvrsavanje.");

        foreach ($zakazane as $templat) {
            $racun = Racun::find($templat->racun_id);

            if (!$racun) {
                Log::warning("Zakazana transakcija ID {$templat->id}: racun nije pronadjen.");
                continue;
            }

            // Dohvati podracun posiljoca i proveri stanje
            $podracun = $this->getPodracun($racun);

            if (!$podracun) {
                Log::warning("Zakazana transakcija ID {$templat->id}: podracun tipa '{$racun->type}' nije pronadjen.");
                continue;
            }

            if ($podracun->stanje_racuna < $templat->iznos) {
                Log::warning("Zakazana transakcija ID {$templat->id}: nedovoljno sredstava (stanje: {$podracun->stanje_racuna}, iznos: {$templat->iznos}).");
                continue;
            }

            // Kreira novu (stvarnu) transakciju na osnovu templejta
            Transakcija::create([
                'id'                   => rand(100000000000000, 999999999999999),
                'racun_id'             => $templat->racun_id,
                'iznos'                => $templat->iznos,
                'naziv_primaoca'       => $templat->naziv_primaoca,
                'broj_racuna_primaoca' => $templat->broj_racuna_primaoca,
                'opis_transakcije'     => $templat->opis_transakcije,
                'sifra_placanja'       => $templat->sifra_placanja,
                'datum'                => $today->toDateString(),
                'vreme'                => Carbon::now()->format('H:i:s'),
                'is_scheduled'         => false,
            ]);

            // Odbija iznos sa racuna posiljoca
            $podracun->stanje_racuna -= $templat->iznos;
            $podracun->save();

            // DODATO: ako je interna transakcija, pronadji primaoca i dodaj mu iznos
            $this->kreditirajPrimaoca($templat->broj_racuna_primaoca, $templat->iznos);

            // Pomera sledece_izvrsavanje za tacno mesec dana
            $sledece = Carbon::parse($templat->sledece_izvrsavanje)->addMonth();
            $templat->sledece_izvrsavanje = $sledece->toDateString();
            $templat->save();

            $this->info("Izvrsena zakazana transakcija ID {$templat->id} za racun {$racun->id}.");
        }

        $this->info('Gotovo.');
        return Command::SUCCESS;
    }

    // Vraca odgovarajuci podracun (TekuciRacun, StudentskiRacun, itd.) za dati Racun
    private function getPodracun(Racun $racun)
    {
        return match($racun->type) {
            'tekuci'    => TekuciRacun::find($racun->id_podtipa),
            'studentski'=> StudentskiRacun::find($racun->id_podtipa),
            'stedni'    => StedniRacun::find($racun->id_podtipa),
            'devizni'   => DevizniRacun::find($racun->id_podtipa),
            default     => null,
        };
    }

    // Proverava da li postoji interni racun sa datim brojem racuna i kreditira ga
    private function kreditirajPrimaoca(string $brojRacuna, float $iznos): void
    {
        $tipovi = [
            'tekuci'     => TekuciRacun::class,
            'studentski' => StudentskiRacun::class,
            'stedni'     => StedniRacun::class,
            'devizni'    => DevizniRacun::class,
        ];

        foreach ($tipovi as $podracunModel) {
            $podracun = $podracunModel::where('broj_racuna', $brojRacuna)->first();
            if ($podracun) {
                $podracun->stanje_racuna += $iznos;
                $podracun->save();
                return;
            }
        }
        // Nije interni racun — eksterno placanje, nema kreditiranja
    }
}
