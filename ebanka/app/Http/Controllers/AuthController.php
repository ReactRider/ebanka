<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Admin;

class AuthController extends Controller
{
    public function login(Request $request) {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string|min:8'
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            // Ako su kredencijali tačni, dobijamo korisnika
            $korisnik = Auth::user();
            
            // Generišemo API token za korisnika
            $token = $korisnik->createToken('ebanka')->plainTextToken;

            // Vraćamo token kao odgovor
            return response()->json([
                'token' => $token,
            ]);
        }

        return response()->json('greska pri log in-u', 401);
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['poruka' => 'Uspesno odjavljivanje iz aplikacije!'], 200);
    }


    public function register(Request $request){
        $validate=$request->validate([
            'ime'=>'required|string|max:50',
            'prezime'=>'required|string|max:50',
            'datum_rođenja'=>'required|date',
            'adresa'=>'required|string',
            'grad'=>'required|string',
            'maticni_broj'=>'required|string|size:13',
            'broj_licne_karte'=>'required|string|size:9',
            'broj_telefona'=>'required|string|size:10',
            'drzava'=>'required|string',
            'email'=>'required|string|max:255',
            'password'=>'required|string|min:8'
        ]);

        $user=User::create([
            'ime'=>$validate['ime'],
            'prezime'=>$validate['prezime'],
            'datum_rođenja'=>$validate['datum_rođenja'],
            'adresa'=>$validate['adresa'],
            'grad'=>$validate['grad'],
            'maticni_broj'=>$validate['maticni_broj'],
            'broj_licne_karte'=>$validate['broj_licne_karte'],
            'broj_telefona'=>$validate['broj_telefona'],
            'drzava'=>$validate['drzava'],
            'email'=>$validate['email'],
            'password'=>bcrypt($validate['password'])
        ]);

        $token = $user->createToken('ebanka')->plainTextToken;
        
        return response()->json(['data'=>$user,'access_token'=>$token,'token_type'=>'Bearer']);
    }

    public function logInSysAdmin(Request $request) {
        $request->validate([
            'email'=> 'required|email',
            'password'=> 'required|string|min:8'
        ]);

        $admin = Admin::where('email', $request['email'])->firstOrFail();

        if($admin && Hash::check($request->password, $admin->password)) {

            $token = $admin->createToken('Admin Access Token')->plainTextToken;

            return response()->json(['message' => 'Hi ' . $admin->name . ', welcome to admin home', 'access_token' => $token, 'token_type' => 'Bearer']);
        }

        return response()->json("greska pri log in-u admina");
    }

    public function logInSubAdmin(Request $request) {
        $request->validate([
            'email'=> 'required|email',
            'password'=> 'required|string|min:8',
            'banka_id'=> 'required|integer'
        ]);

        $admin = Admin::where('email', $request['email'])->firstOrFail();

        if($admin && Hash::check($request->password, $admin->password)) {

            $token = $admin->createToken('Admin Access Token')->plainTextToken;

            return response()->json(['message' => 'Hi ' . $admin->name . ', welcome to admin home', 'access_token' => $token, 'token_type' => 'Bearer']);
        }

        return response()->json("greska pri log in-u admina");
    }
}

