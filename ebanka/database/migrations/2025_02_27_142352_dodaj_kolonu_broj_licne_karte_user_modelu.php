<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('broj_licne_karte', 11);
            $table->string('broj_telefona');
            $table->string('drzava');
            $table->text('profile_photo')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('broj_licne_karte');
            $table->dropColumn('broj_telefona');
            $table->dropColumn('drzava');
            $table->text('profile_photo');
        });
    }
};
