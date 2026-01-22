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
        $type = $payload['type'];

        try {
            switch ($type) {
                case 'checkout.session.completed':
                case 'customer.subscription.created':
                    $this->handleSubscriptionChange($payload);
                    break;

                case 'invoice.payment_succeeded':
                    $this->handlePaymentSuccess($payload);
                    break;

                case 'customer.subscription.deleted':
                    $this->handleSubscriptionDeleted($payload);
                    break;
            }
        } catch (Throwable $e) {
            Log::error("Erro ao processar Webhook Stripe [{$type}]: ".$e->getMessage());
        }
    }

    /**
     * Gerencia a atribuição de permissões (Roles) ao usuário.
     */
    private function handleSubscriptionChange(array $payload): void
    {
        $stripeId = $payload['data']['object']['customer'];

        // No Stripe, os itens ficam dentro de 'lines' ou 'display_items' dependendo do evento
        $data = $payload['data']['object'];
        $priceId = $data['lines']['data'][0]['price']['id'] ?? $data['metadata']['price_id'] ?? null;

        if (! $priceId) {
            Log::warning("Price ID não encontrado no payload do Stripe para o cliente: {$stripeId}");

            return;
        }

        $user = User::where('stripe_id', $stripeId)->first();

        if ($user) {
            $role = $this->getRoleFromPriceId($priceId);
            $user->syncRoles([$role]);
            Log::info("Role '{$role}' sincronizada para o usuário: {$user->email}");
        }
    }

    /**
     * Lógica de limpeza quando a assinatura é cancelada.
     */
    private function handleSubscriptionDeleted(array $payload): void
    {
        $stripeId = $payload['data']['object']['customer'];
        $user = User::where('stripe_id', $stripeId)->first();

        if ($user) {
            $user->syncRoles(['free']); // Retorna ao plano básico
            Log::info("Usuário {$user->email} voltou para o plano free (assinatura deletada).");
        }
    }

    /**
     * Mapeamento centralizado de IDs de Preço para Roles.
     */
    private function getRoleFromPriceId(string $priceId): string
    {
        $mapping = [
            config('plans.plans.pro.price_id') => 'pro',
            config('plans.plans.enterprise.price_id') => 'enterprise',
        ];

        return $mapping[$priceId] ?? 'free';
    }

    /**
     * Confirma que o pagamento de uma fatura foi realizado com sucesso.
     * Ideal para renovar o acesso ou liberar pedidos.
     */
    private function handlePaymentSuccess(array $payload): void
    {
        $object = $payload['data']['object'];
        $stripeId = $object['customer'];
        $invoiceUrl = $object['hosted_invoice_url']; // Link da fatura em PDF

        $user = User::where('stripe_id', $stripeId)->first();

        if (!$user) {
            Log::error("Stripe Webhook: Pagamento recebido, mas usuário não encontrado. Stripe ID: {$stripeId}");
            return;
        }

        // 1. Log do sucesso para auditoria
        Log::info("Pagamento confirmado para o usuário: {$user->email}. Fatura: {$invoiceUrl}");

        // 2. Opcional: Atualizar a data de expiração ou status no seu banco
        // $user->update(['trial_ends_at' => null, 'last_payment_at' => now()]);

        // 3. Opcional: Notificar o usuário via Email/Notificação
        // $user->notify(new PaymentReceivedNotification($invoiceUrl));
        
        // 4. Se for a primeira compra, o syncRoles já deve ter ocorrido no 'subscription.created',
        // mas é uma boa prática garantir que ele tenha a role aqui também.
        if (isset($object['lines']['data'][0]['price']['id'])) {
            $role = $this->getRoleFromPriceId($object['lines']['data'][0]['price']['id']);
            $user->syncRoles([$role]);
        }
    }
}