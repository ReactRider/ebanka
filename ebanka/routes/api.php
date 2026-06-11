<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BankController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AccountInfoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ExchangeRatesController;
use App\Http\Controllers\TransakcijaController;
use App\Http\Controllers\RacunController;
use App\Http\Controllers\TekuciRacunController;
use App\Http\Controllers\StudentskiRacunController;
use App\Http\Controllers\StedniRacunController;
use App\Http\Controllers\DevizniRacunController;
use App\Http\Controllers\TransactionsExportController;
use App\Http\Controllers\GraphicDisplayController;
use App\Http\Controllers\ProfilePhoto;
use App\Http\Controllers\ChatController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware("auth:sanctum")->get("/user", function (Request $request) {
    return $request->user();
});


// Rute za autentifikovane korisnike 
Route::middleware(['auth:sanctum', 'isRegularUser'])->group( function() {
    //nove rute
    Route::get("/korisnik/izvrsene-transakcije/{racun_id}",[TransakcijaController::class,"prikaz_transakcija"]);
    Route::get("/korisnik/transakcija/{id}",[TransakcijaController::class,"show"]);
    Route::post("/korisnik/nova-transakcija",[TransakcijaController::class,"store"]);

    Route::get("/korisnik/tekuci_racun/{id}",[TekuciRacunController::class,"show"]);
    Route::get("/korisnik/studentski_racun/{id}",[StudentskiRacunController::class,"show"]);
    Route::get("/korisnik/devizni_racun/{id}",[DevizniRacunController::class,"show"]);
    Route::get("/korisnik/stedni_racun/{id}",[StedniRacunController::class,"show"]);
    
    Route::patch("/korisnik/devizni_racun/{broj_racuna}/{novo_stanje}",[DevizniRacunController::class,"changeBalance"]);
    Route::patch("/korisnik/tekuci_racun/{broj_racuna}/{novo_stanje}",[TekuciRacunController::class,"changeBalance"]);

    Route::get("/korisnik/bankovni-racuni", [UserController::class, "prikazi_racune"]);

    Route::patch("/korisnik/izmena-naloga", [UserController::class, 'update']);

    Route::patch("/korisnik/izmena-tekuceg-stanja-racuna/{id}",[TekuciRacunController::class,'update']);
    Route::patch("/korisnik/izmena-studentskog-stanja-racuna/{id}",[StudentskiRacunController::class,'update']);
    Route::patch("/korisnik/izmena-deviznog-stanja-racuna/{id}",[DevizniRacunController::class,'update']);

    Route::patch("/korisnik/promena-tekuceg-stanja-racuna/{id}",[TekuciRacunController::class,'promena_stanja']);
    Route::patch("/korisnik/promena-studentskog-stanja-racuna/{id}",[StudentskiRacunController::class,'promena_stanja']);
    Route::patch("/korisnik/promena-deviznog-stanja-racuna/{id}",[DevizniRacunController::class,'promena_stanja']);


    Route::get("/korisnik/export/{racun_id}/{mesec}/{godina}", [TransactionsExportController::class, "export"]);

    Route::post("/korisnik/postavljanje-slike",[ProfilePhoto::class,"uploadProfilePhoto"]);
    Route::get("/korisnik/uzimanje-slike",[ProfilePhoto::class,"getProfilePhoto"]);

    Route::get("/korisnik/kursna-lista/{date}", [ExchangeRatesController::class, "fetchRates"]);
    Route::get("/korisnik/informacije-o-nalogu", [AccountInfoController::class, "showUser"]);
    Route::post("/korisnik/logout", [AuthController::class, "logout"]);

    Route::get("/korisnik/svi_ostali_racuni",[UserController::class,"ostali_racuni"]);

    Route::post("/korisnik/total-amonut/month", [GraphicDisplayController::class, 'getDataMonth']);
    Route::post("/korisnik/total-amonut/year", [GraphicDisplayController::class, 'getDataYear']);
    Route::post("/korisnik/total-amonut/quarter", [GraphicDisplayController::class, 'getDataQuarter']);


    //Chat bot

    // DODATO: rute za zakazane (recurring) transakcije
    Route::get('/korisnik/zakazane-transakcije/{racun_id}', [TransakcijaController::class, 'zakazane_transakcije']);
    Route::patch('/korisnik/zakazana-transakcija/{id}/deaktiviraj', [TransakcijaController::class, 'deaktiviraj']);

    // DODATO: rute za notifikacije
    Route::get('/korisnik/dolazne-transakcije', [TransakcijaController::class, 'dolazneTransakcije']);
    Route::get('/korisnik/nove-izvrsene-zakazane', [TransakcijaController::class, 'noveIzvrseneZakazane']);

});

// Adminska grupa ruta
Route::middleware(['auth:sanctum', 'isAdmin'])->group(function () {
    Route::get('/admin/pretraga-korisnika/{jmbg}', [UserController::class, 'findByJMBG']);
    Route::get('/admin/pretraga-banaka/{naziv}', [BankController::class, 'findByNaziv']);
    
    Route::resource("/admin/banke", BankController::class);   
    Route::resource("/admin/korisnici", UserController::class);

    Route::delete("/admin/obrisi-racune-i-transakcije", [TransakcijaController::class, "destroy"]);
    
    Route::get("/admin/bankovni-racuni-korisnika/{id}", [UserController::class, "prikazi_racune"]);
    
    Route::patch("/admin/promeni-korisnika/{id}", [UserController::class, "updateAdmin"]);

    Route::get("/admin/racuni-vezani-za-banku/{id}", [BankController::class, "svi_povezani_racuni"]);

    Route::get("/admin/informacije-o-nalogu-system-admin", [AccountInfoController::class, "showAdmin"]);
    Route::get("/admin/kursna-lista", [ExchangeRatesController::class, "fetchRates"]);
    
    Route::delete("/admin/tekuci_racun/{id}",[TekuciRacunController::class,"destroy"]);
    Route::delete("/admin/stedni_racun/{id}",[StedniRacunController::class,"destroy"]);
    Route::delete("/admin/studentski_racun/{id}",[StudentskiRacunController::class,"destroy"]);
    Route::delete("/admin/devizni_racun/{id}",[DevizniRacunController::class,"destroy"]);

    Route::post("/admin/kreiranje-tekuci_racun",[TekuciRacunController::class,"store"]);
    Route::post("/admin/kreiranje-studentski_racun",[StudentskiRacunController::class,"store"]);
    Route::post("/admin/kreiranje-devizni_racun",[DevizniRacunController::class,"store"]);
    Route::post("/admin/kreiranje-stedni_racun",[StedniRacunController::class,"store"]);
    
    Route::post("/admin/logout-system-admin", [AuthController::class, "logout"]);
});

Route::middleware(["auth:sanctum", "isSubAdmin"])->group(function() {
    Route::get("/admin/svi-racuni-banke/{id}", [AdminController::class, "getAllBankAccounts"]);
    Route::get("/admin/svi-korisnici-banke/{id}", [AdminController::class, "getAllBankUsers"]);
  
    Route::get("/admin/informacije-o-nalogu-sub-admin", [AccountInfoController::class, "showAdmin"]);

    Route::get("/admin/broj-korisnika-godisnje/{id}",[AdminController::class,"userPerYear"]);
    Route::get("/admin/broj-tipova-racuna/{id}",[AdminController::class,"percentTypeRacun"]);
    Route::get("/admin/izvrsene-transakcije/{racun_id}",[TransakcijaController::class,"prikaz_transakcija"]);
    Route::get("/admin/racuni-korisnika-uBanci/{banka_id}/{user_id}",[AdminController::class, "racuni_za_korisnika_u_banci"]);
    Route::get("/admin/potrosnja_korisnika_mesecno/{racun_id}",[AdminController::class,"potrosnja_korisnika"]);

    Route::post("/admin/logout-sub-admin", [AuthController::class, "logout"]);

});


// Za neautentifikovane korisnike
Route::middleware("guest")->group( function() {
    // log in ruta za logovanje korisnika
    Route::post("/korisnik/login", [AuthController::class, "login"]);
    
    //nezasticena ruta za logovanje admina
    Route::post('/admin/login-system-admin', [AuthController::class, "logInSysAdmin"]);

    //nezasticena ruta za logovanje admina
    Route::post('/admin/login-sub-admin', [AuthController::class, "logInSubAdmin"]);

    // sign up ruta
    Route::post("/registracija",[AuthController::class,"register"]);

    // 2FA verifikacija
    Route::post('/korisnik/verify-2fa', [AuthController::class, 'verifyTwoFactor']);
    Route::post('/admin/verify-2fa-system-admin', [AuthController::class, 'verifyAdminTwoFactor']);
    Route::post('/admin/verify-2fa-sub-admin', [AuthController::class, 'verifyAdminTwoFactor']);
    
    //ruta za ucitavanje kursnih lista
    Route::get("/kursna-lista", [ExchangeRatesController::class, "fetchRates"]);
    Route::get("/sve-banke",[BankController::class,"index"]);
});


Route::post('/chat', [ChatController::class, 'respond']);