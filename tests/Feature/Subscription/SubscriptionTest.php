<?php

use App\Models\User;
use Laravel\Cashier\Cashier;
use Stripe\Customer;

beforeEach(function () {
    Cashier::useCustomerModel(Customer::class);
});

test('a página de assinatura é exibida', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('subscription.index'));

    $response->assertOk();
});

test('o usuário pode criar uma assinatura', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->postJson(route('subscription.store'), [
            'price_id' => 'price_test_123',
            'payment_method_id' => 'pm_card_visa',
            'name' => 'default',
        ]);

    $response->assertStatus(201);
    $response->assertJsonStructure([
        'message',
        'subscription',
    ]);
});

test('o usuário não pode criar uma assinatura duplicada', function () {
    $user = User::factory()->create();

    $this
        ->actingAs($user)
        ->postJson(route('subscription.store'), [
            'price_id' => 'price_test_123',
            'payment_method_id' => 'pm_card_visa',
            'name' => 'default',
        ]);

    $response = $this
        ->actingAs($user)
        ->postJson(route('subscription.store'), [
            'price_id' => 'price_test_456',
            'payment_method_id' => 'pm_card_visa',
            'name' => 'default',
        ]);

    $response->assertStatus(422);
    $response->assertJson([
        'message' => "O usuário já tem uma assinatura ativa chamada 'default'.",
    ]);
});

test('o usuário pode cancelar a assinatura', function () {
    $user = User::factory()->create();

    $this
        ->actingAs($user)
        ->postJson(route('subscription.store'), [
            'price_id' => 'price_test_123',
            'payment_method_id' => 'pm_card_visa',
        ]);

    $response = $this
        ->actingAs($user)
        ->postJson(route('subscription.cancel'), [
            'subscription_name' => 'default',
            'immediately' => false,
        ]);

    $response->assertOk();
    $response->assertJsonStructure([
        'message',
        'subscription',
    ]);
});

test('o usuário pode retomar a assinatura cancelada', function () {
    $user = User::factory()->create();

    $this
        ->actingAs($user)
        ->postJson(route('subscription.store'), [
            'price_id' => 'price_test_123',
            'payment_method_id' => 'pm_card_visa',
        ]);

    $this
        ->actingAs($user)
        ->postJson(route('subscription.cancel'), [
            'subscription_name' => 'default',
        ]);

    $response = $this
        ->actingAs($user)
        ->postJson(route('subscription.resume'), [
            'subscription_name' => 'default',
        ]);

    $response->assertOk();
    $response->assertJsonStructure([
        'message',
        'subscription',
    ]);
});

test('o usuário pode mudar o plano da assinatura', function () {
    $user = User::factory()->create();

    $this
        ->actingAs($user)
        ->postJson(route('subscription.store'), [
            'price_id' => 'price_test_123',
            'payment_method_id' => 'pm_card_visa',
        ]);

    $response = $this
        ->actingAs($user)
        ->postJson(route('subscription.change-plan'), [
            'new_price_id' => 'price_test_456',
            'subscription_name' => 'default',
            'prorate' => true,
        ]);

    $response->assertOk();
    $response->assertJsonStructure([
        'message',
        'subscription',
    ]);
});

test('a criação da assinatura requer dados válidos', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->postJson(route('subscription.store'), [
            'price_id' => '',
            'payment_method_id' => '',
        ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['price_id', 'payment_method_id']);
});

test('usuário não autenticado não pode acessar rotas de assinatura', function () {
    $this->getJson(route('subscription.index'))->assertUnauthorized();
    $this->postJson(route('subscription.store'))->assertUnauthorized();
    $this->postJson(route('subscription.cancel'))->assertUnauthorized();
    $this->postJson(route('subscription.resume'))->assertUnauthorized();
    $this->postJson(route('subscription.change-plan'))->assertUnauthorized();
});
