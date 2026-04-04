<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Admin;
use App\Models\Banka;
use App\Models\Racun;
use App\Models\User;
use App\Models\Transakcija;
use App\Http\Resources\RacunCollection;
use App\Http\Resources\UserCollection;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class AdminController extends Controller
{
    public function getAllBankAccounts($banka_id) {
        $admin = Auth::user();

        if($admin->banka_id == $banka_id) {
            $banka = Banka::findOrFail($banka_id);
            return new RacunCollection($banka->racun);
        } else {
            return response()->json(['Greška!', 'Admin ne pristupa podacima odgovarajuće banke!']);
        }

    }

    public function getAllBankUsers($banka_id) {
        $admin = Auth::user();
        
        if($admin->banka_id == $banka_id) {
            $perPage = 7;

            $userIds = \App\Models\Racun::where('banka_id', $banka_id)
                ->pluck('user_id')
                ->unique()
                ->values();

            $page = request()->get('page', 1);
            $usersQuery = \App\Models\User::whereIn('id', $userIds);
            $total = $usersQuery->count();
            $users = $usersQuery
                ->forPage($page, $perPage)
                ->get();

            $paginatedUsers = new LengthAwarePaginator(
                $users,
                $total,
                $perPage,
                $page,
                ['path' => request()->url(), 'query' => request()->query()]
            );

            return new UserCollection($paginatedUsers);
        } else {
            return response()->json(['Greška!', 'Admin ne pristupa podacima odgovarajuće banke!']);
        }

    }


    public function userPerYear($banka_id){
        $admin=Auth::user();
        if($admin->banka_id==$banka_id){
            $banka = Banka::findOrFail($banka_id);
            $racuni = $banka->racun;
            $users = [];
            $usersId=[];

            foreach ($racuni as $racun) {
                array_push($users, $racun->user);
            }

            $unique_users = array_unique($users);
            foreach($unique_users as $oneUser){
                array_push($usersId, $oneUser->id);
            }

             $usersPerYear = User::whereIn('id', $usersId)
            ->selectRaw('YEAR(created_at) as year, COUNT(*) as count')
            ->groupBy('year')
            ->orderBy('year')
            ->get();

            return response()->json($usersPerYear);

        }else{
            return response()->json(['Greska!','Admin ne pristupa podacima odgovarajuce banke!']);
        }
    }


    public function percentTypeRacun($banka_id){
        $admin=Auth::user();
        if($admin->banka_id==$banka_id){
            $banka = Banka::findOrFail($banka_id);
            $racuni = $banka->racun;

            $statistika = Racun::where('banka_id', $banka_id)
            ->select('type', \DB::raw('count(*) as ukupno'))
            ->groupBy('type')
            ->get();

            return response()->json($statistika);
        }else{
            return response()->json(['Greska!','Admin nema pristup podacima!']);
        }
    }

    public function racuni_za_korisnika_u_banci($banka_id, $user_id){
        $svi_racuni= Racun::where('banka_id', $banka_id)
                ->where('user_id', $user_id)
                ->get();
        return new RacunCollection($svi_racuni); 
    }


    public function potrosnja_korisnika($racun_id){
        $data = Transakcija::select(
                DB::raw("DATE_FORMAT(datum, '%Y-%m') as month"),
                DB::raw("SUM(iznos) as total_spent")
            )
            ->where('racun_id', $racun_id)
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        return response()->json($data);


    }

}
