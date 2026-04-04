<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use GuzzleHttp\Client;

class ExchangeRatesController extends Controller
{
    public function fetchRates($date="") {
        if($date == "") 
            $response = Http::get("https://kurs.resenje.org/api/v1/rates/today");
        else if($date != "") 
            $response = Http::get("https://kurs.resenje.org/api/v1/rates/${date}");

        if(strlen($date) === 3) 
            $response = Http::get("https://kurs.resenje.org/api/v1/currencies/${date}/rates/today");

        return response()->json($response->json());
    }
}
