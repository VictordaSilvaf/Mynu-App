<?php

use App\Models\Menu;
use App\Models\Store;
use App\Models\User;

test('public can view active menu without auth', function () {
    $user = User::factory()->create();
    $store = Store::factory()->for($user)->create(['name' => 'Loja Teste', 'colors' => ['#000000']]);
    $menu = Menu::factory()->for($store)->create(['is_active' => true]);

    $response = $this->get(route('public.menu.show', $menu));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('public-menu')
        ->has('menu')
        ->has('store')
        ->where('store.name', 'Loja Teste')
        ->has('sections')
    );
});

test('public gets 404 for inactive menu', function () {
    $user = User::factory()->create();
    $store = Store::factory()->for($user)->create();
    $menu = Menu::factory()->for($store)->create(['is_active' => false]);

    $response = $this->get(route('public.menu.show', $menu));

    $response->assertNotFound();
});
