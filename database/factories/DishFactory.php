<?php

namespace Database\Factories;

use App\Models\Section;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Dish>
 */
class DishFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $dishes = [
            'Bruschetta Italiana',
            'Carpaccio de Salmão',
            'Risoto de Funghi',
            'Filé Mignon ao Molho Madeira',
            'Spaghetti Carbonara',
            'Pizza Margherita',
            'Tiramisù',
            'Panna Cotta',
        ];

        return [
            'store_id' => Store::factory(),
            'section_id' => Section::factory(),
            'name' => $this->faker->randomElement($dishes),
            'description' => $this->faker->sentence(10),
            'price' => $this->faker->randomFloat(2, 15, 150),
            'image' => $this->faker->optional()->imageUrl(640, 480, 'food'),
            'order' => $this->faker->numberBetween(0, 20),
            'is_active' => $this->faker->boolean(95),
            'is_available' => $this->faker->boolean(85),
        ];
    }
}
