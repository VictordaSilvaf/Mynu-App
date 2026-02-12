<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('subscription index renders', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('subscription.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('subscription/index')
        ->has('subscriptions')
        ->has('subscription_status')
        ->has('has_payment_method'));
});
