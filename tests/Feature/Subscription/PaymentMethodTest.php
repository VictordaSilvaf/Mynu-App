<?php

use App\Models\User;
use Laravel\Cashier\Cashier;
use Stripe\Customer;

beforeEach(function () {
    Cashier::useCustomerModel(Customer::class);
});

test('payment methods page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('payment-methods.index'));

    $response->assertOk();
});

test('user can update payment method', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->postJson(route('payment-methods.update'), [
            'payment_method_id' => 'pm_card_visa',
            'set_as_default' => true,
        ]);

    $response->assertOk();
    $response->assertJson([
        'message' => 'Método de pagamento atualizado com sucesso!',
    ]);
});

test('user can delete payment method', function () {
    $user = User::factory()->create();

    $this
        ->actingAs($user)
        ->postJson(route('payment-methods.update'), [
            'payment_method_id' => 'pm_card_visa',
        ]);

    $response = $this
        ->actingAs($user)
        ->deleteJson(route('payment-methods.destroy', ['paymentMethodId' => 'pm_card_visa']));

    $response->assertOk();
    $response->assertJson([
        'message' => 'Método de pagamento removido com sucesso!',
    ]);
});

test('payment method update requires valid data', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->postJson(route('payment-methods.update'), [
            'payment_method_id' => '',
        ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['payment_method_id']);
});

test('unauthenticated user cannot access payment method routes', function () {
    $this->getJson(route('payment-methods.index'))->assertUnauthorized();
    $this->postJson(route('payment-methods.update'))->assertUnauthorized();
    $this->deleteJson(route('payment-methods.destroy', ['paymentMethodId' => 'pm_test']))->assertUnauthorized();
});
