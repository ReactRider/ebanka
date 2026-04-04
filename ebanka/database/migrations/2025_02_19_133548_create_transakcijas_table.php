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
        Schema::create('transakcijas', function (Blueprint $table) {
            $table->unsignedBigInteger('id');
            $table->foreignId('racun_id');
            $table->primary(['id', 'racun_id']);
            
            $table->string('broj_racuna_primaoca');
            $table->double('iznos', 10, 2);
            $table->date('datum');
            $table->time('vreme');
            $table->text('opis_transakcije');
            $table->integer('sifra_placanja');
            $table->string('naziv_primaoca');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transakcijas');
    }
};
