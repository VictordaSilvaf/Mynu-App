<?php

namespace Database\Factories;

use App\Models\Menu;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Section>
 */
class SectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $sections = [
            'Entradas',
            'Pratos Principais',
            'Massas',
            'Pizzas',
            'Sobremesas',
            'Bebidas',
            'Vinhos',
            'Cafés',
        ];

        return [
            'menu_id' => Menu::factory(),
            'name' => $this->faker->randomElement($sections),
            'description' => $this->faker->optional()->sentence(),
            'order' => $this->faker->numberBetween(0, 10),
            'is_active' => $this->faker->boolean(90),
        ];
    }
}
