<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StedniRacun>
 */
class StedniRacunFactory extends Factory
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
            'tip_stednje'=>fake()->randomElement(['orocena','stednja po vidjenju']),
            'kamata'=>fake()->randomFloat(2,0,100),
            'stanje_racuna'=>fake()->randomFloat(2,0,100000),
            'odrzavanje'=>fake()->randomFloat(2,0,500),
        ];
    }
}
