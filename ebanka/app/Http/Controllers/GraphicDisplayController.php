<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transakcija;

class GraphicDisplayController extends Controller
{
    public function getDataMonth(Request $request){
     
        $id=$request->racun_id;

        $qurey= Transakcija::selectRaw("DATE_FORMAT(datum, '%Y-%m') AS period, SUM(iznos) AS total_spent")->where('racun_id',$id)->groupBy('period')->orderBy('period');

        return $qurey->get();

    }


    
    public function getDataYear(Request $request){
      
        $id=$request->racun_id;
        $query=Transakcija::selectRaw("DATE_FORMAT(datum, '%Y') AS period, SUM(iznos) AS total_spent")->where('racun_id',$id)->groupBy('period')->orderBy('period');

        return $query->get();

    }


    
    public function getDataQuarter(Request $request){
     
        $id=$request->racun_id;
        $upit=Transakcija::selectRaw("CONCAT(YEAR(datum), '-Q', QUARTER(datum)) AS period, SUM(iznos) AS total_spent")->where('racun_id', $id)->groupByRaw("CONCAT(YEAR(datum), '-Q', QUARTER(datum))")->orderByRaw("YEAR(datum), QUARTER(datum)");
                               
        return $upit->get();

    }
}
