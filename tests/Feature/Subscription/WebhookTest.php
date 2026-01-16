<?php

use App\Jobs\Stripe\HandleCustomerSubscriptionCreated;
use App\Jobs\Stripe\HandleCustomerSubscriptionDeleted;
use App\Jobs\Stripe\HandleCustomerSubscriptionUpdated;
use App\Jobs\Stripe\HandleInvoicePaid;
use App\Jobs\Stripe\HandleInvoicePaymentFailed;
use Illuminate\Support\Facades\Queue;

test('webhook processa evento de fatura paga', function () {
    Queue::fake();

    $payload = [
        'type' => 'invoice.payment_succeeded',
        'data' => [
            'object' => [
                'id' => 'in_test_123',
                'customer' => 'cus_test_123',
                'amount_paid' => 1000,
            ],
        ],
    ];

    $response = $this->postJson(route('stripe.webhook'), $payload);

    $response->assertOk();

    Queue::assertPushed(HandleInvoicePaid::class);
});

test('webhook processa evento de falha no pagamento da fatura', function () {
    Queue::fake();

    $payload = [
        'type' => 'invoice.payment_failed',
        'data' => [
            'object' => [
                'id' => 'in_test_123',
                'customer' => 'cus_test_123',
                'amount_due' => 1000,
            ],
        ],
    ];

    $response = $this->postJson(route('stripe.webhook'), $payload);

    $response->assertOk();

    Queue::assertPushed(HandleInvoicePaymentFailed::class);
});

test('webhook processa evento de assinatura de cliente criada', function () {
    Queue::fake();

    $payload = [
        'type' => 'customer.subscription.created',
        'data' => [
            'object' => [
                'id' => 'sub_test_123',
                'customer' => 'cus_test_123',
                'status' => 'active',
            ],
        ],
    ];

    $response = $this->postJson(route('stripe.webhook'), $payload);

    $response->assertOk();

    Queue::assertPushed(HandleCustomerSubscriptionCreated::class);
});

test('webhook processa evento de assinatura de cliente atualizada', function () {
    Queue::fake();

    $payload = [
        'type' => 'customer.subscription.updated',
        'data' => [
            'object' => [
                'id' => 'sub_test_123',
                'customer' => 'cus_test_123',
                'status' => 'active',
            ],
        ],
    ];

    $response = $this->postJson(route('stripe.webhook'), $payload);

    $response->assertOk();

    Queue::assertPushed(HandleCustomerSubscriptionUpdated::class);
});

test('webhook processa evento de assinatura de cliente deletada', function () {
    Queue::fake();

    $payload = [
        'type' => 'customer.subscription.deleted',
        'data' => [
            'object' => [
                'id' => 'sub_test_123',
                'customer' => 'cus_test_123',
            ],
        ],
    ];

    $response = $this->postJson(route('stripe.webhook'), $payload);

    $response->assertOk();

    Queue::assertPushed(HandleCustomerSubscriptionDeleted::class);
});
