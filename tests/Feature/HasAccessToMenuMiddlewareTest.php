<?php

use App\Models\Menu;
use App\Models\Store;
use App\Models\User;

test('user without menu is redirected to store page when accessing menus', function () {
    $user = User::factory()->create();
    Store::factory()->for($user)->create();

    $response = $this->actingAs($user)->get(route('menus.index'));

    $response->assertRedirect(route('stores.index'));
    $response->assertSessionHas('error', 'Você precisa ter uma loja para criar cardápios.');
});

test('user with menu can access menus', function () {
    $user = User::factory()->create();
    $store = Store::factory()->for($user)->create();
    Menu::factory()->for($store)->create();

    $response = $this->actingAs($user)->get(route('menus.index'));

    $response->assertStatus(200);
});
