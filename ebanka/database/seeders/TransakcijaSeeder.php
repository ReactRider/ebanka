<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TransakcijaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */

   // protected $racunn;

    /*public function __construst(RacunSeeder $racun){
        $this->racunn=$racun;
    }
*/


    public function run()
    {
        Transakcija::factory()->create([
            'racun_id'=>$racunn->id,
        ]);
    }
}
