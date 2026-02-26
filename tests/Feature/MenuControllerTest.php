<?php

use App\Models\Menu;
use App\Models\Store;
use App\Models\User;
use Spatie\Permission\Models\Role;

test('store redirects to menus index with error when store is incomplete', function () {
    Role::firstOrCreate(['name' => 'free', 'guard_name' => 'web']);
    $user = User::factory()->create();
    $user->assignRole('free');
    Store::factory()->for($user)->create([
        'name' => 'Loja',
        'phones' => [],
        'colors' => ['#000000'],
    ]);

    $response = $this->actingAs($user)->post(route('menus.store'), [
        'name' => 'Meu Cardápio',
    ]);

    $response->assertRedirect(route('menus.index'));
    $response->assertSessionHas('error', 'Complete os dados da loja antes de criar um cardápio.');
    $this->assertDatabaseCount('menus', 0);
});

test('store creates menu when store is complete', function () {
    Role::firstOrCreate(['name' => 'free', 'guard_name' => 'web']);
    $user = User::factory()->create();
    $user->assignRole('free');
    Store::factory()->for($user)->create([
        'name' => 'Loja Completa',
        'phones' => ['+5511999999999'],
        'colors' => ['#000000'],
    ]);

    $response = $this->actingAs($user)->post(route('menus.store'), [
        'name' => 'Meu Cardápio',
    ]);

    $response->assertRedirect(route('menus.index'));
    $this->assertDatabaseHas('menus', ['name' => 'Meu Cardápio']);
});

test('destroy redirects to menus index', function () {
    $user = User::factory()->create();
    $store = Store::factory()->for($user)->create();
    $menu = Menu::factory()->for($store)->create();

    $response = $this->actingAs($user)->delete(route('menus.destroy', $menu));

    $response->assertRedirect(route('menus.index'));
    $this->assertDatabaseMissing('menus', ['id' => $menu->id]);
});

test('duplicate creates a copy of the menu with sections and dishes', function () {
    $user = User::factory()->create();
    $store = Store::factory()->for($user)->create();
    $menu = Menu::factory()->for($store)->create(['name' => 'Original']);
    $section = $menu->sections()->create([
        'name' => 'Entradas',
        'description' => null,
        'order' => 0,
        'is_active' => true,
    ]);
    $section->dishes()->create([
        'store_id' => $store->id,
        'name' => 'Bruschetta',
        'price' => 25.90,
        'order' => 0,
        'is_active' => true,
        'is_available' => true,
    ]);

    $response = $this->actingAs($user)->post(route('menus.duplicate', $menu));

    $response->assertRedirect();
    $this->assertDatabaseHas('menus', ['name' => 'Original (cópia)']);
    $newMenu = $store->menus()->where('name', 'Original (cópia)')->first();
    $this->assertNotNull($newMenu);
    $this->assertFalse($newMenu->is_active);
    $this->assertEquals(1, $newMenu->sections()->count());
    $this->assertEquals(1, $newMenu->sections()->first()->dishes()->count());
});
