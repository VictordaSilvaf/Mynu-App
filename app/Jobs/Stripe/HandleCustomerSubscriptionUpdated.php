<?php

namespace App\Jobs\Stripe;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class HandleCustomerSubscriptionUpdated implements ShouldQueue
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
            Log::warning('Subscription updated webhook: User not found', [
                'customer_id' => $subscription['customer'],
            ]);

            return;
        }

        Log::info('Subscription updated successfully', [
            'user_id' => $user->id,
            'subscription_id' => $subscription['id'],
            'status' => $subscription['status'],
        ]);

        // Aqui você pode adicionar lógica adicional, como:
        // - Atualizar permissões do usuário
        // - Enviar notificação sobre mudança de plano
        // - Registrar analytics
    }
}
