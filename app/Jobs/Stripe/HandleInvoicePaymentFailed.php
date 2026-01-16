<?php

namespace App\Jobs\Stripe;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class HandleInvoicePaymentFailed implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public array $payload,
    ) {}

    public function handle(): void
    {
        $invoice = $this->payload['data']['object'];

        $user = User::where('stripe_id', $invoice['customer'])->first();

        if (! $user) {
            Log::warning('Invoice payment failed webhook: User not found', [
                'customer_id' => $invoice['customer'],
            ]);

            return;
        }

        Log::error('Invoice payment failed', [
            'user_id' => $user->id,
            'invoice_id' => $invoice['id'],
            'amount' => $invoice['amount_due'],
        ]);

        // Aqui você pode adicionar lógica adicional, como:
        // - Enviar email notificando falha no pagamento
        // - Suspender acesso a recursos premium
        // - Atualizar status da conta
    }
}
