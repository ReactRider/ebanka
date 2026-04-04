<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StudentskiRacun>
 */
class StudentskiRacunFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'broj_racuna'=> fake()->numerify('###') .'-'. fake()->numerify('#########') .'-'. fake()->numerify('###'),
            'stanje_racuna'=>fake()->randomFloat(2,0,100000),
        ];
    }
}
