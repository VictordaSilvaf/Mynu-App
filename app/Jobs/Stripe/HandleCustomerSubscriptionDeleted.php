<?php

namespace App\Jobs\Stripe;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class HandleCustomerSubscriptionDeleted implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public array $payload,
    ) {}

    public function handle(): void
    {
        $subscription = $this->payload['data']['object'];

        $user = User::where('stripe_id', $subscription['customer'])->first();

        if (! $user) {
            Log::warning('Subscription deleted webhook: User not found', [
                'customer_id' => $subscription['customer'],
            ]);

            return;
        }

        Log::info('Subscription deleted successfully', [
            'user_id' => $user->id,
            'subscription_id' => $subscription['id'],
        ]);

        // Aqui você pode adicionar lógica adicional, como:
        // - Remover permissões premium do usuário
        // - Enviar email de encerramento
        // - Registrar analytics
    }
}
