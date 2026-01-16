<?php

namespace App\Jobs\Stripe;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class HandleInvoicePaid implements ShouldQueue
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
            Log::warning('Invoice paid webhook: User not found', [
                'customer_id' => $invoice['customer'],
            ]);

            return;
        }

        Log::info('Invoice paid successfully', [
            'user_id' => $user->id,
            'invoice_id' => $invoice['id'],
            'amount' => $invoice['amount_paid'],
        ]);

        // Aqui você pode adicionar lógica adicional, como:
        // - Enviar email de confirmação
        // - Atualizar créditos do usuário
        // - Registrar analytics
    }
}
