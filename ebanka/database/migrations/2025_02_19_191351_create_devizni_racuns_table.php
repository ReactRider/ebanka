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
        Schema::create('devizni_racuns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('racun_id');
            $table->string('broj_racuna');
            $table->string('valuta');
            $table->double('stanje_racuna', 10, 2);
            $table->double('odrzavanje', 10, 2);
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
        Schema::dropIfExists('devizni_racuns');
    }
};
