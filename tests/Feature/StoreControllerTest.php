<?php

use App\Models\Store;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('it renders the store page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('stores.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('store/index')
    );
});

test('it creates a store for the authenticated user', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $storeData = [
        'name' => 'My Awesome Store',
        'phones' => ['123456789'],
        'colors' => ['#ffffff'],
        'whatsapp' => '+1234567890',
        'instagram' => 'myawesomestore',
    ];

    $response = $this->post(route('stores.store'), $storeData);

    $response->assertRedirect(route('stores.index'));
    $this->assertDatabaseHas('stores', [
        'user_id' => $user->id,
        'name' => 'My Awesome Store',
    ]);
});

test('it updates the store for the authenticated user', function () {
    $user = User::factory()->create();
    $store = Store::factory()->create(['user_id' => $user->id]);
    $this->actingAs($user);

    $updatedStoreData = [
        'name' => 'My Updated Store',
        'phones' => ['987654321'],
        'colors' => ['#000000'],
        'whatsapp' => '+19876543210',
        'instagram' => 'myupdatedstore',
    ];

    $response = $this->put(route('stores.update', $store->id), $updatedStoreData);

    $response->assertRedirect(route('stores.index'));
    $this->assertDatabaseHas('stores', [
        'id' => $store->id,
        'name' => 'My Updated Store',
    ]);
});

test('it validates the request data', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('stores.store'), ['name' => '']);
    $response->assertSessionHasErrors('name');

    $response = $this->post(route('stores.store'), ['phones' => ['1', '2', '3', '4']]);
    $response->assertSessionHasErrors('phones');

    $response = $this->post(route('stores.store'), ['colors' => ['1', '2', '3', '4']]);
    $response->assertSessionHasErrors('colors');

    $response = $this->post(route('stores.store'), ['whatsapp' => 'invalid-number']);
    $response->assertSessionHasErrors('whatsapp');
});

test('a user can only update their own store', function () {
    $user1 = User::factory()->create();
    $store1 = Store::factory()->create(['user_id' => $user1->id]);

    $user2 = User::factory()->create();
    $this->actingAs($user2);

    $response = $this->put(route('stores.update', $store1->id), ['name' => 'New Name']);

    $response->assertStatus(404);
});
