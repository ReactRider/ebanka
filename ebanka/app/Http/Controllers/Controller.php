<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use App\Models\TekuciRacun;
use App\Models\DevizniRacun;
use App\Models\StedniRacun;
use App\Models\StudentskiRacun;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function pronadji_podtip($id_podtip, $tip){
        switch($tip){
            case 'tekuci':
                return TekuciRacun::findOrFail($id_podtip);
                break;
            case 'stedni':
                return StedniRacun::findOrFail($id_podtip);
                break;
            case 'studentski':
                return StudentskiRacun::findOrFail($id_podtip);
                break;
            case 'devizni':
                return DevizniRacun::findOrFail($id_podtip);
                break;
            default:
                return 'Nije pronadjen';
        }
    }

}
