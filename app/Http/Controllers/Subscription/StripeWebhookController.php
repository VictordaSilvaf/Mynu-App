<?php

namespace App\Http\Controllers\Subscription;

use App\Jobs\Stripe\HandleCustomerSubscriptionCreated;
use App\Jobs\Stripe\HandleCustomerSubscriptionDeleted;
use App\Jobs\Stripe\HandleCustomerSubscriptionUpdated;
use App\Jobs\Stripe\HandleInvoicePaid;
use App\Jobs\Stripe\HandleInvoicePaymentFailed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Http\Controllers\WebhookController;

class StripeWebhookController extends WebhookController
{
    /**
     * Handle invoice paid event.
     */
    protected function handleInvoicePaymentSucceeded(array $payload): void
    {
        HandleInvoicePaid::dispatch($payload);
    }

    /**
     * Handle invoice payment failed event.
     */
    protected function handleInvoicePaymentFailed(array $payload): void
    {
        HandleInvoicePaymentFailed::dispatch($payload);
    }

    /**
     * Handle customer subscription created event.
     */
    protected function handleCustomerSubscriptionCreated(array $payload): void
    {
        HandleCustomerSubscriptionCreated::dispatch($payload);
    }

    /**
     * Handle customer subscription updated event.
     */
    protected function handleCustomerSubscriptionUpdated(array $payload): void
    {
        HandleCustomerSubscriptionUpdated::dispatch($payload);
    }

    /**
     * Handle customer subscription deleted event.
     */
    protected function handleCustomerSubscriptionDeleted(array $payload): void
    {
        HandleCustomerSubscriptionDeleted::dispatch($payload);
    }

    /**
     * Handle a failed webhook call.
     */
    protected function handleWebhookFailed(Request $request, \Throwable $exception): void
    {
        Log::error('Stripe webhook failed', [
            'exception' => $exception->getMessage(),
            'payload' => $request->all(),
        ]);
    }
}
