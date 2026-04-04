<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Http\Resources\UserResource;
use App\Http\Resources\RacunResource;
use App\Http\Resources\UserCollection;
use App\Http\Resources\RacunCollection;
use Illuminate\Support\Facades\Storage;
use App\Models\Racun;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $perPage = 7;
        $users = User::paginate($perPage);
        return response()->json($users);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        // Ovaj metod je obično za prikaz forme u aplikaciji (ne koristi se za API)
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
            
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ime' => 'required|string|max:50',
            'prezime' => 'required|string|max:50',
            'email' => 'required|string',
            'password' => 'required|string|min:8',
            'drzava' => 'required|string',
            'grad'=>'required|string',
            'broj_licne_karte' => 'required|string|size:9',
            'maticni_broj'=>'required|string|size:13',
            'broj_telefona'=>'required|string|size:10',
            'adresa' => 'required|string',
            'datum_rođenja' => 'required|date'
        ]);

        $korisnik = User::create([
            'ime' => $validated['ime'],
            'prezime' => $validated['prezime'],
            'datum_rođenja' => $validated['datum_rođenja'],
            'adresa' => $validated['adresa'],
            'grad' => $validated['grad'],
            'maticni_broj' => $validated['maticni_broj'],
            'broj_licne_karte'=>$validated['broj_licne_karte'],
            'email' => $validated['email'],
            'broj_telefona'=>$validated['broj_telefona'],
            'drzava'=>$validated['drzava'],
            'password' => Hash::make($validated['password']),
            'remember_token' => Str::random(10),  // Generisanje random tokena
            'email_verified_at' => null,  // Početno postavljamo kao null dok ne verifikujemo email
        ]);

        return response()->json(new UserResource($korisnik), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $korisnikk = User::findOrFail($id);
        return new UserResource($korisnikk);
    }

    public function findByJMBG($jmbg) {
        if($jmbg === 'cleared-field' || strlen($jmbg) < 3) return response()->json([]);

        $korisnici = User::where('maticni_broj', 'LIKE', $jmbg . '%')->limit(10)->get();
        return $korisnici;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        // Ovaj metod je obično za prikaz forme u aplikaciji (ne koristi se za API)
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $korisnik = Auth::User();

        $validated = $request->validate([
            'adresa' => 'string',
            'grad' => 'string',
            'email' => 'string|max:255',
        ]);
        
        
        if(isset($validated['adresa']) ) 
            $korisnik->adresa = $validated['adresa'];
        if(isset($validated['grad'])) 
            $korisnik->grad = $validated['grad'];
        if(isset($validated['email']))
            $korisnik->email = $validated['email'];

        $korisnik->save();

        return response()->json(['poruka'=>'Uspesno izmenjen korisnik!','korisnik'=>new UserResource($korisnik)]);
    }

    public function updateAdmin(Request $request, $korisnik_id)
    {
        $korisnik = User::find($korisnik_id);

        $validated = $request->validate([
            'adresa' => 'required|string',
            'grad' => 'required|string',
            'drzava' => 'required|string',
            'email' => 'required|string|max:255',
            'password' => 'required|string|min:8',
            'ime' => 'required|string',
            'prezime' => 'required|string',
            'datum_rođenja' => 'required|date',
            'maticni_broj' => 'required|string|size:13',
            'broj_licne_karte' => 'required|string|size:9',
            'broj_telefona'=>'required|string|size:10',
        ]);
        
        
        if(isset($validated['adresa']) ) 
            $korisnik->adresa = $validated['adresa'];
        if(isset($validated['grad'])) 
            $korisnik->grad = $validated['grad'];
        if(isset($validated['email']))
            $korisnik->email = $validated['email'];
        if(isset($validated['password']) ) 
            $korisnik->password = Hash::make($validated['password']);
        if(isset($validated['drzava'])) 
            $korisnik->drzava = $validated['drzava'];
        if(isset($validated['broj_licne_karte']))
            $korisnik->broj_licne_karte = $validated['broj_licne_karte'];
        if(isset($validated['broj_telefona']) ) 
            $korisnik->broj_telefona = $validated['broj_telefona'];
        if(isset($validated['ime'])) 
            $korisnik->ime = $validated['ime'];
        if(isset($validated['prezime']))
            $korisnik->prezime = $validated['prezime'];
        if(isset($validated['maticni_broj']) ) 
            $korisnik->maticni_broj = $validated['maticni_broj'];
        if(isset($validated['datum_rođenja']) ) 
            $korisnik->datum_rođenja = $validated['datum_rođenja'];
        

        $korisnik->save();

        return response()->json(['poruka'=>'Uspesno izmenjen korisnik!','korisnik'=>new UserResource($korisnik)]);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $korisnik = User::findOrFail($id);
        $korisnik->delete();
        return response()->json(['message'=>'Uspesno obrisano'],200);
    }



    public function prikazi_racune($korisnik_id="") {
        if($korisnik_id == "") {
            $korisnik = Auth::user();
            $racuni = $korisnik->racun;
            return new RacunCollection($racuni);
        } else {
            $korisnik = User::findOrFail($korisnik_id);
            $racuni = $korisnik->racun;
            return new RacunCollection($racuni);
        }
    }


    public function ostali_racuni(Request $request){
        $user=$request->user();
        $r=Racun::where('user_id',$user->id)->where(function ($query) {
            $query->where('type', 'tekuci')->orWhere('type', 'studentski');
        })->where('id','!=',$request->id)->get();

        return new RacunCollection($r);
    }



}
