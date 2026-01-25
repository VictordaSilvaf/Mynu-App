<?php

use App\Models\Dish;
use App\Models\Menu;
use App\Models\Store;
use App\Models\User;
use App\Models\Visit;
use Illuminate\Support\Carbon;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('dashboard'))->assertOk();
});

test('it returns the correct metrics', function () {
    $user = User::factory()->create();
    $store = Store::factory()->for($user)->create();

    $menus = Menu::factory()->for($store)->count(3)->create();

    $dishes = Dish::factory()->for($store)->count(5)->create([
        'is_active' => true,
    ]);

    Dish::factory()->for($store)->count(2)->create([
        'is_active' => false,
    ]);

    // Simulate visits in the last 7 days
    Carbon::setTestNow(now());
    for ($i = 0; $i < 10; $i++) {
        Visit::factory()->for($store)->for($dishes->random())->create([
            'visited_at' => now()->subDays(rand(0, 6)),
        ]);
    }

    // Simulate visits outside the 7-day period
    for ($i = 0; $i < 5; $i++) {
        Visit::factory()->for($store)->for($dishes->random())->create([
            'visited_at' => now()->subDays(8),
        ]);
    }

    $this->actingAs($user);

    $this->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('metrics')
            ->where('metrics.totalAccess', 10)
            ->where('metrics.activeProducts', 5)
            ->where('metrics.createdMenus', 3)
            ->has('metrics.lastUpdate')
            ->has('metrics.mostAccessedProducts', 5)
        );
});
