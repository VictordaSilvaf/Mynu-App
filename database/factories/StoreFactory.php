<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Store>
 */
class StoreFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => $this->faker->company,
            'phones' => [$this->faker->phoneNumber],
            'colors' => [$this->faker->hexColor],
            'operating_hours' => [],
            'whatsapp' => '+55119'.$this->faker->numerify('########'),
            'instagram' => $this->faker->userName,
            'document_type' => 'cnpj',
            'document_number' => $this->faker->numerify('##############'),
        ];
    }
}
