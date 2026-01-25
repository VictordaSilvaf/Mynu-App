<?php

use App\Models\Dish;
use App\Models\Menu;
use App\Models\Section;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

test('pro user can create a dish', function () {
    Storage::fake('public');
    Role::create(['name' => 'pro', 'guard_name' => 'web']);

    $user = User::factory()->create();
    $user->assignRole('pro');

    $menu = Menu::factory()->create(['user_id' => $user->id]);
    $section = Section::factory()->create(['menu_id' => $menu->id]);

    $response = $this->actingAs($user)->post(route('dishes.store'), [
        'section_id' => $section->id,
        'name' => 'Risoto de Funghi',
        'description' => 'Delicioso risoto',
        'price' => 58.90,
        'order' => 1,
        'is_active' => true,
        'is_available' => true,
        'image' => UploadedFile::fake()->image('dish.jpg'),
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('dishes', [
        'section_id' => $section->id,
        'name' => 'Risoto de Funghi',
        'price' => 58.90,
    ]);
});

test('pro user can update a dish', function () {
    Role::create(['name' => 'pro', 'guard_name' => 'web']);

    $user = User::factory()->create();
    $user->assignRole('pro');

    $menu = Menu::factory()->create(['user_id' => $user->id]);
    $section = Section::factory()->create(['menu_id' => $menu->id]);
    $dish = Dish::factory()->create(['section_id' => $section->id]);

    $response = $this->actingAs($user)->post(route('dishes.update', $dish), [
        'name' => 'Risoto Updated',
        'price' => 65.00,
        '_method' => 'PUT',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('dishes', [
        'id' => $dish->id,
        'name' => 'Risoto Updated',
    ]);
});

test('pro user can delete a dish', function () {
    Role::create(['name' => 'pro', 'guard_name' => 'web']);

    $user = User::factory()->create();
    $user->assignRole('pro');

    $menu = Menu::factory()->create(['user_id' => $user->id]);
    $section = Section::factory()->create(['menu_id' => $menu->id]);
    $dish = Dish::factory()->create(['section_id' => $section->id]);

    $response = $this->actingAs($user)->delete(route('dishes.destroy', $dish));

    $response->assertRedirect();
    $this->assertDatabaseMissing('dishes', [
        'id' => $dish->id,
    ]);
});
