<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// DODATO: Migracija za podrsku zakazanih (recurring) transakcija.
// Dodaje 4 nullable kolone u tabelu transakcijas.
// Redovi sa is_scheduled=true su templejti i ne prikazuju se u istoriji.
return new class extends Migration
{
    public function up()
    {
        Schema::table('transakcijas', function (Blueprint $table) {
            // Oznacava da je red templat zakazane transakcije (ne prava transakcija)
            $table->boolean('is_scheduled')->default(false)->after('naziv_primaoca');

            // Dan u mesecu kada se transakcija izvrsava (1-28)
            $table->unsignedTinyInteger('dan_u_mesecu')->nullable()->after('is_scheduled');

            // Sledeci datum izvrsavanja; pomera se za mesec dana nakon svakog izvrsavanja
            $table->date('sledece_izvrsavanje')->nullable()->after('dan_u_mesecu');

            // Korisnik moze deaktivirati zakazanu transakciju bez brisanja
            $table->boolean('is_active')->nullable()->after('sledece_izvrsavanje');
        });
    }

    public function down()
    {
        Schema::table('transakcijas', function (Blueprint $table) {
            $table->dropColumn(['is_scheduled', 'dan_u_mesecu', 'sledece_izvrsavanje', 'is_active']);
        });
    }
};
