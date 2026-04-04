<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'ime' => fake()->firstName(),
            'prezime' => fake()->lastName(),
            'datum_rođenja' => fake()->date(),
            'adresa' => fake()->address(),
            'grad' => fake()->city(),
            'maticni_broj' => fake()->numerify('#############'),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => bcrypt('lozinka123'),
            'broj_licne_karte' => fake()->ssn(),
            'drzava'=>fake()->country(),
            'broj_telefona'=>fake()->numerify('###') .'-'. fake()->numerify('###') . ' ' . fake()->numerify('####'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return static
     */
    public function unverified()
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
