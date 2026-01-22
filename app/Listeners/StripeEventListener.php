<?php

namespace App\Listeners;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Events\WebhookReceived;
use Throwable;

class StripeEventListener
{
    /**
     * Manipula o evento de Webhook recebido do Stripe.
     */
    public function handle(WebhookReceived $event): void
    {
        $payload = $event->payload;
        $type = $payload['type'] ?? null;

        try {
            match ($type) {
                'checkout.session.completed',
                'customer.subscription.created' => $this->syncUserSubscription($payload),

                'invoice.payment_succeeded',
                'payment_intent.succeeded' => $this->handlePaymentSuccess($payload),

                'customer.subscription.deleted' => $this->handleSubscriptionDeleted($payload),

                default => null,
            };
        } catch (Throwable $e) {
            Log::error("Stripe Webhook Error [{$type}]: {$e->getMessage()}", [
                'payload' => $payload,
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }

    /**
     * Centraliza a lógica de sincronização de assinatura e roles.
     */
    private function syncUserSubscription(array $payload): void
    {
        $object = $payload['data']['object'];
        $stripeId = $object['customer'] ?? null;

        if (! $user = $this->findUser($stripeId)) {
            return;
        }

        // Para customer.subscription.created - cria no banco se não existir
        if ($payload['type'] === 'customer.subscription.created') {
            $subscriptionId = $object['id'];
            $priceId = $object['items']['data'][0]['price']['id'] ?? null;

            if (! $priceId) {
                Log::warning("Price ID missing for subscription: {$subscriptionId}");

                return;
            }

            // Verifica se a subscription já existe no banco
            $existingSubscription = $user->subscriptions()
                ->where('stripe_id', $subscriptionId)
                ->first();

            if (! $existingSubscription) {
                // Cria a subscription no banco
                $user->subscriptions()->create([
                    'type' => $object['metadata']['name'] ?? 'default',
                    'stripe_id' => $subscriptionId,
                    'stripe_status' => $object['status'],
                    'stripe_price' => $priceId,
                    'quantity' => $object['items']['data'][0]['quantity'] ?? 1,
                    'trial_ends_at' => $object['trial_end'] ? now()->timestamp($object['trial_end']) : null,
                    'ends_at' => $object['ended_at'] ? now()->timestamp($object['ended_at']) : null,
                ]);

                Log::info('Subscription created in database', [
                    'user_id' => $user->id,
                    'subscription_id' => $subscriptionId,
                ]);
            }

            $role = $this->getRoleFromPriceId($priceId);
            $user->syncRoles([$role]);

            Log::info('User subscription synced', [
                'email' => $user->email,
                'role' => $role,
                'subscription_id' => $subscriptionId,
            ]);

            return;
        }

        // Para checkout.session.completed
        $priceId = $object['metadata']['price_id']
            ?? $object['lines']['data'][0]['price']['id']
            ?? null;

        if (! $priceId) {
            Log::warning("Price ID missing for Stripe Customer: {$stripeId}");

            return;
        }

        $role = $this->getRoleFromPriceId($priceId);
        $user->syncRoles([$role]);

        Log::info('User subscription synced', ['email' => $user->email, 'role' => $role]);
    }

    /**
     * Gerencia a limpeza quando a assinatura é encerrada.
     */
    private function handleSubscriptionDeleted(array $payload): void
    {
        $stripeId = $payload['data']['object']['customer'] ?? null;

        if ($user = $this->findUser($stripeId)) {
            $user->syncRoles(['free']);
            Log::info('User downgraded to free', ['email' => $user->email]);
        }
    }

    /**
     * Processa o sucesso do pagamento e logs de auditoria.
     */
    private function handlePaymentSuccess(array $payload): void
    {
        $object = $payload['data']['object'];
        $stripeId = $object['customer'] ?? null;

        if (! $user = $this->findUser($stripeId)) {
            return;
        }

        // Auditoria de pagamento
        Log::channel('stripe_webhooks_success')->info('Payment confirmed', [
            'email' => $user->email,
            'invoice' => $object['hosted_invoice_url'] ?? 'N/A',
        ]);

        // Sincroniza a role para garantir consistência após o pagamento
        $this->syncUserSubscription($payload);
    }

    /**
     * Busca o usuário com base no Stripe ID.
     */
    private function findUser(?string $stripeId): ?User
    {
        if (! $stripeId) {
            return null;
        }

        $user = User::query()->where('stripe_id', $stripeId)->first();

        if (! $user) {
            Log::error("Stripe Webhook: User not found for Stripe ID: {$stripeId}");
        }

        return $user;
    }

    /**
     * Mapeamento de IDs de Preço para Roles usando match.
     */
    private function getRoleFromPriceId(string $priceId): string
    {
        return match ($priceId) {
            config('plans.plans.pro.price_id_monthly'),
            config('plans.plans.pro.price_id_yearly'),
            config('plans.plans.pro.price_id') => 'pro',

            config('plans.plans.enterprise.price_id_monthly'),
            config('plans.plans.enterprise.price_id_yearly'),
            config('plans.plans.enterprise.price_id') => 'enterprise',

            default => 'free',
        };
    }
}
