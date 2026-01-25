<?php

use App\Models\Menu;
use App\Models\Section;
use App\Models\Store;
use App\Models\User;
use Spatie\Permission\Models\Role;

test('pro user can create a section', function () {
    Role::create(['name' => 'pro', 'guard_name' => 'web']);

    $user = User::factory()->create();
    $user->assignRole('pro');
    $store = Store::factory()->for($user)->create();

    $menu = Menu::factory()->for($store)->create();

    $response = $this->actingAs($user)->post(route('sections.store'), [
        'menu_id' => $menu->id,
        'name' => 'Entradas',
        'description' => 'Pratos de entrada',
        'order' => 1,
        'is_active' => true,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('sections', [
        'menu_id' => $menu->id,
        'name' => 'Entradas',
    ]);
});

test('pro user can update a section', function () {
    Role::create(['name' => 'pro', 'guard_name' => 'web']);

    $user = User::factory()->create();
    $user->assignRole('pro');
    $store = Store::factory()->for($user)->create();

    $menu = Menu::factory()->for($store)->create();
    $section = Section::factory()->for($menu)->create();

    $response = $this->actingAs($user)->put(route('sections.update', $section), [
        'name' => 'Massas Updated',
        'description' => 'Updated description',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('sections', [
        'id' => $section->id,
        'name' => 'Massas Updated',
    ]);
});

test('pro user can delete a section', function () {
    Role::create(['name' => 'pro', 'guard_name' => 'web']);

    $user = User::factory()->create();
    $user->assignRole('pro');
    $store = Store::factory()->for($user)->create();

    $menu = Menu::factory()->for($store)->create();
    $section = Section::factory()->for($menu)->create();

    $response = $this->actingAs($user)->delete(route('sections.destroy', $section));

    $response->assertRedirect();
    $this->assertDatabaseMissing('sections', [
        'id' => $section->id,
    ]);
});
