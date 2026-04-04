<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Banka;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Banka>
 */
class BankaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $nazivi = ["Raiffeisen Banka", "OTP Banka", "NLB Komercijalna Banka", "Erste Banka", "Unicredit Banka", "Banca Intessa", "Banka Postanska Stedionica", "Societe Generale"];

        do {
            $naziv = fake()->randomElement($nazivi);
        } while (Banka::where('naziv', $naziv)->exists());
    
        return [
            'naziv'=>$naziv,
            'grad'=>fake()->city(),
            'broj_dozvole'=>fake()->numerify('#####'),
        ];
    }
}
