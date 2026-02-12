<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia;
use Laravel\Cashier\Subscription;

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

test('subscription index maps billing data for table', function () {
    $user = User::factory()->create();
    $trialEndsAt = now()->addDays(5);

    Subscription::create([
        'user_id' => $user->id,
        'type' => 'default',
        'stripe_id' => 'sub_test_123',
        'stripe_status' => 'active',
        'stripe_price' => config('plans.plans.pro.price_id_monthly'),
        'quantity' => 1,
        'trial_ends_at' => $trialEndsAt,
        'ends_at' => null,
    ]);

    $response = $this->actingAs($user)->get(route('subscription.index'));

    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('subscription/index')
        ->has('subscriptions', 1)
        ->where('subscriptions.0.plan_name', 'Pro')
        ->where('subscriptions.0.next_billing_date', $trialEndsAt->toIso8601String()));
});
