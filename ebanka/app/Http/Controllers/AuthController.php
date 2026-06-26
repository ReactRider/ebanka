<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Notifications\SendOtpNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Admin;

class AuthController extends Controller
{
    public function login(Request $request) {
        $request->validate([
            'email'    => 'required|string',
            'password' => 'required|string|min:8',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json('greska pri log in');
        }

        $korisnik = Auth::user();

        $otp =strval(random_int(100001, 999999));

        $korisnik->otp_code       = $otp;
        $korisnik->otp_expires_at = Carbon::now()->addMinutes(1);
        $korisnik->save();

        Auth::logout();

        $korisnik->notify(new SendOtpNotification($otp));

        return response()->json(['requires_2fa' => true], 200);
    }

    public function verifyTwoFactor(Request $request) {
        $request->validate([
            'email' => 'required|string|email',
            'code'  => 'required|string|size:6',
        ]);

        $korisnik = User::where('email', $request->email)->first();

        if (!$korisnik) {
            return response()->json('Korisnik nije pronađen.', 404);
        }

        if (
            $korisnik->otp_code !== $request->code 
                ) {
            return response()->json('Uneli ste neispravan kod.');
                }

        if (
            Carbon::now() > $korisnik->otp_expires_at
        ) {
            return response()->json('Kod je istekao - molimo generišite kod novom prijavom.');
        }

        $korisnik->otp_code       = null;
        $korisnik->otp_expires_at = null;
        $korisnik->save();

        $korisnik->tokens()->delete();
        $token = $korisnik->createToken('ebanka')->plainTextToken;

        return response()->json(['token' => $token]);
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['poruka' => 'Uspešno odjavljivanje iz aplikacije!'], 200);
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
            'email'    => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json('greska pri log in-u admina');
        }

        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $admin->otp_code       = $otp;
        $admin->otp_expires_at = Carbon::now()->addMinutes(1);
        $admin->save();

        $admin->notify(new SendOtpNotification($otp));

        return response()->json(['requires_2fa' => true], 200);
    }

    public function logInSubAdmin(Request $request) {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string|min:8',
            'banka_id' => 'required|integer',
        ]);

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json('greska pri log in-u admina');
        }

        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $admin->otp_code       = $otp;
        $admin->otp_expires_at = Carbon::now()->addMinutes(1);
        $admin->save();

        $admin->notify(new SendOtpNotification($otp));

        return response()->json(['requires_2fa' => true], 200);
    }

    public function verifyAdminTwoFactor(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'code'  => 'required|string|size:6',
        ]);

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin) {
            return response()->json('Admin nije pronađen.');
        }

        if (
            $admin->otp_code !== $request->code
        ) {
            return response()->json('Uneli ste netačan kod.');
        }

        if(
            Carbon::now()->isAfter($admin->otp_expires_at)
        ) {
            return response()->json('Kod je istekao - molimo generišite kod novom prijavom.');
        }

        $admin->otp_code       = null;
        $admin->otp_expires_at = null;
        $admin->save();

        $admin->tokens()->delete();
        $token = $admin->createToken('Admin Access Token')->plainTextToken;

        return response()->json([
            'message'      => 'Hi ' . $admin->ime . ', welcome to admin home',
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ]);
    }
}
