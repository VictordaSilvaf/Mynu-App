<?php

namespace Database\Factories;

use App\Models\Dish;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Visit>
 */
class VisitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'store_id' => Store::factory(),
            'dish_id' => Dish::factory(),
            'visited_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
