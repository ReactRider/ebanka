<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $u1=\App\Models\User::factory()->create();
        $u2=\App\Models\User::factory()->create();
        $u3=\App\Models\User::factory()->create();
        \App\Models\User::factory(5)->create();

        $b1=\App\Models\Banka::factory()->create();
        $b2=\App\Models\Banka::factory()->create();
        $b3=\App\Models\Banka::factory()->create();
        \App\Models\Banka::factory(3)->create();

        $r1=\App\Models\Racun::create([
            'user_id'=>$u1->id,
            'banka_id'=>$b1->id,
            'type'=>'tekuci',
        ]);

        $tekuci=\App\Models\TekuciRacun::factory()->create([
            'racun_id'=>$r1->id
        ]);


        \App\Models\Transakcija::factory(5)->create([
            'racun_id'=>$r1->id,
        ]);

        

        $r2=\App\Models\Racun::create([
            'user_id'=>$u1->id,
            'banka_id'=>$b1->id,
            'type'=>'devizni',
        ]);

        $devizni=\App\Models\DevizniRacun::factory()->create([
            'racun_id'=>$r2->id
        ]);

        \App\Models\Transakcija::factory(2)->create([
            'racun_id'=>$r2->id,
        ]);

        $r3=\App\Models\Racun::create([
            'user_id'=>$u2->id,
            'banka_id'=>$b1->id,
            'type'=>'tekuci',
        ]);

        $tekuci_2=\App\Models\TekuciRacun::factory()->create([
            'racun_id'=>$r3->id
        ]);

        $r4=\App\Models\Racun::create([
            'user_id'=>$u3->id,
            'banka_id'=>$b2->id,
            'type'=>'studentski',
        ]);


        $studentski=\App\Models\StudentskiRacun::factory()->create([
            'racun_id'=>$r4->id
        ]);

        

        $r5=\App\Models\Racun::create([
            'user_id'=>$u3->id,
            'banka_id'=>$b1->id,
            'type'=>'stedni',
        ]);

        $stedni=\App\Models\StedniRacun::factory()->create([
            'racun_id'=>$r5->id
        ]);

        

        $r6=\App\Models\Racun::create([
            'user_id'=>$u1->id,
            'banka_id'=>$b3->id,
            'type'=>'studentski',
        ]);


        $studentski_2 = \App\Models\StudentskiRacun::factory()->create([
            'racun_id'=>$r6->id
        ]);

        /*
        $this->call([
            $user=\Database\Seeders\UserSeeder::class,
            $banka=\Database\Seeders\BankaSeeder::class,
            $tekuci=\Database\Seeders\TekuciRacunSeeder::class,
            $studentski=\Database\Seeders\StudentskiRacunSeeder::class,
            $stedni=\Database\Seeders\StedniRacunSeeder::class,
            $devizni=\Database\Seeders\DevizniRacunSeeder::class,

            $racun=\Database\Seeders\RacunSeeder::class=>(['user'=>'$user','banka'=>'$banka','tekuci'=>'$tekuci', 'stedni'=>'null','devizni'=>'null','studentski'=>'null']),
            $t=\Database\Seeders\TransakcijaSeeder::class=>(['racun'=>'$racun']),


        ]);*/

       
         

    }
}
