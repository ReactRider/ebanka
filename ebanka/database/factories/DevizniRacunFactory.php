<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DevizniRacun>
 */
class DevizniRacunFactory extends Factory
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
            'valuta'=>fake()->randomElement(['EUR', 'USD', 'CHF', 'JPY', 'CAD', 'RUB', 'CNY', 'GBP']),
            'stanje_racuna'=>fake()->randomFloat(2,0,100000),
            'odrzavanje'=>fake()->randomFloat(2,0,500),
        ];
    }
}
