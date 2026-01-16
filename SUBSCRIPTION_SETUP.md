# Sistema de Pagamento - Mynu

Este documento explica como configurar e usar o sistema de pagamento do Mynu, implementado com Laravel Cashier (Stripe).

## Arquitetura

O sistema foi desenvolvido seguindo as melhores práticas de Clean Code e SOLID:

```
app/
├── Actions/Subscription/           # Ações reutilizáveis (Single Responsibility)
│   ├── CreateStripeCustomerAction.php
│   ├── CreateSubscriptionAction.php
│   ├── UpdatePaymentMethodAction.php
│   ├── CancelSubscriptionAction.php
│   ├── SwapSubscriptionPlanAction.php
│   └── ResumeSubscriptionAction.php
├── DataTransferObjects/Subscription/  # DTOs para transferência de dados
│   ├── SubscriptionData.php
│   ├── PlanChangeData.php
│   └── PaymentMethodData.php
├── Services/                       # Service Layer (Business Logic)
│   └── SubscriptionService.php
├── Http/
│   ├── Controllers/Subscription/   # Controllers enxutos
│   │   ├── SubscriptionController.php
│   │   ├── PaymentMethodController.php
│   │   └── StripeWebhookController.php
│   └── Requests/Subscription/      # Form Requests (Validation)
│       ├── CreateSubscriptionRequest.php
│       ├── UpdatePaymentMethodRequest.php
│       ├── ChangePlanRequest.php
│       └── CancelSubscriptionRequest.php
└── Jobs/Stripe/                    # Jobs para processar Webhooks
    ├── HandleInvoicePaid.php
    ├── HandleInvoicePaymentFailed.php
    ├── HandleCustomerSubscriptionCreated.php
    ├── HandleCustomerSubscriptionUpdated.php
    └── HandleCustomerSubscriptionDeleted.php
```

## Configuração Inicial

### 1. Configurar Variáveis de Ambiente

Adicione suas chaves do Stripe no arquivo `.env`:

```env
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**IMPORTANTE:** Use chaves de teste durante o desenvolvimento. Nunca commite chaves reais no Git.

### 2. Criar Planos no Stripe

No Dashboard do Stripe, crie seus produtos e preços. Anote os `price_id` de cada plano.

Exemplo:
- Plano Free: `price_free` (gratuito)
- Plano Pro: `price_1234567890` (R$ 29,90/mês)
- Plano Enterprise: `price_0987654321` (R$ 99,90/mês)

### 3. Configurar Webhook no Stripe

1. Acesse o Dashboard do Stripe > Developers > Webhooks
2. Adicione um novo endpoint: `https://seudominio.com/stripe/webhook`
3. Selecione os eventos:
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copie o `Signing secret` e adicione ao `.env` como `STRIPE_WEBHOOK_SECRET`

### 4. Executar Migrações

```bash
vendor/bin/sail artisan migrate
```

## Como Usar

### Frontend - Criar Assinatura

```javascript
import { useForm } from '@inertiajs/react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

function SubscriptionForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { post, processing } = useForm({
    price_id: 'price_1234567890',
    payment_method_id: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    // Criar Payment Method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.error(error);
      return;
    }

    // Enviar para o backend
    post('/subscription', {
      price_id: 'price_1234567890',
      payment_method_id: paymentMethod.id,
    });
  };

  return (
    <Elements stripe={stripePromise}>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={processing}>
          Assinar
        </button>
      </form>
    </Elements>
  );
}
```

### Backend - Processar Assinatura

O Controller recebe a requisição e delega para o Service:

```php
// No SubscriptionController
public function store(CreateSubscriptionRequest $request): JsonResponse
{
    try {
        $subscriptionData = SubscriptionData::fromRequest($request->validated());

        $subscription = $this->subscriptionService->subscribe(
            $request->user(),
            $subscriptionData
        );

        return response()->json([
            'message' => 'Assinatura criada com sucesso!',
            'subscription' => $subscription,
        ], 201);
    } catch (IncompletePayment $e) {
        // Pagamento requer 3D Secure
        return response()->json([
            'payment_intent' => $e->payment->id,
            'redirect_url' => route('cashier.payment', [$e->payment->id]),
        ], 402);
    }
}
```

## Endpoints Disponíveis

### Assinaturas

- `GET /subscription` - Página de gerenciamento de assinatura
- `POST /subscription` - Criar nova assinatura
- `POST /subscription/change-plan` - Trocar plano
- `POST /subscription/cancel` - Cancelar assinatura
- `POST /subscription/resume` - Reativar assinatura

### Métodos de Pagamento

- `GET /payment-methods` - Página de gerenciamento de métodos de pagamento
- `POST /payment-methods` - Adicionar/Atualizar método de pagamento
- `DELETE /payment-methods/{id}` - Remover método de pagamento

### Webhook

- `POST /stripe/webhook` - Endpoint para webhooks do Stripe

## Exemplos de Uso do Service

### Verificar Status da Assinatura

```php
use App\Services\SubscriptionService;

$subscriptionService = app(SubscriptionService::class);

// Verificar se tem assinatura ativa
if ($subscriptionService->hasActiveSubscription($user)) {
    // Usuário está com assinatura ativa
}

// Obter status completo
$status = $subscriptionService->getSubscriptionStatus($user);
// Retorna: [
//   'subscribed' => true,
//   'on_trial' => false,
//   'on_grace_period' => false,
//   'cancelled' => false,
//   'ends_at' => '2025-02-15T10:30:00Z',
//   'stripe_status' => 'active'
// ]
```

### Trocar Plano Programaticamente

```php
use App\DataTransferObjects\Subscription\PlanChangeData;

$planChangeData = new PlanChangeData(
    newPriceId: 'price_enterprise',
    prorate: true,
    invoiceNow: false
);

$subscription = $subscriptionService->changePlan($user, $planChangeData);
```

## Tratamento de Erros

O sistema trata os seguintes erros de forma específica:

### 1. Pagamento com 3D Secure

```php
try {
    $subscription = $subscriptionService->subscribe($user, $data);
} catch (IncompletePayment $e) {
    // Redirecionar usuário para confirmar pagamento
    return redirect()->route('cashier.payment', [
        $e->payment->id,
        'redirect' => route('subscription.index')
    ]);
}
```

### 2. Assinatura Duplicada

```php
try {
    $subscription = $subscriptionService->subscribe($user, $data);
} catch (\Exception $e) {
    // "User already has an active subscription named 'default'."
}
```

## Webhooks

Os webhooks são processados de forma assíncrona usando Jobs:

1. **HandleInvoicePaid** - Quando pagamento é confirmado
2. **HandleInvoicePaymentFailed** - Quando pagamento falha
3. **HandleCustomerSubscriptionCreated** - Quando assinatura é criada
4. **HandleCustomerSubscriptionUpdated** - Quando assinatura é atualizada
5. **HandleCustomerSubscriptionDeleted** - Quando assinatura é cancelada

Você pode adicionar lógica customizada em cada Job, como:
- Enviar emails
- Atualizar permissões do usuário
- Registrar analytics
- Atualizar créditos

## Testes

Execute os testes do sistema de pagamento:

```bash
# Todos os testes
vendor/bin/sail artisan test --compact

# Apenas testes de assinatura
vendor/bin/sail artisan test --compact tests/Feature/Subscription/

# Teste específico
vendor/bin/sail artisan test --compact --filter="user can create a subscription"
```

## Boas Práticas

1. **Ambiente de Testes**: Use sempre chaves de teste do Stripe durante desenvolvimento
2. **Webhook Secret**: Configure o `STRIPE_WEBHOOK_SECRET` para validar webhooks
3. **Tratamento de Exceções**: Sempre use try-catch ao criar assinaturas
4. **3D Secure**: Implemente fluxo de redirecionamento para pagamentos que requerem autenticação adicional
5. **Logs**: Os Jobs de webhook já fazem log automático de eventos importantes
6. **Queue**: Configure uma fila para processar webhooks de forma assíncrona

## Segurança

- ✅ Webhooks validados com assinatura do Stripe
- ✅ CSRF token excluído apenas para rotas de webhook
- ✅ Autenticação obrigatória para todas as rotas de assinatura
- ✅ Form Requests validam todos os dados de entrada
- ✅ DTOs garantem type safety entre camadas

## Suporte

Para questões sobre o Stripe, consulte:
- [Documentação do Laravel Cashier](https://laravel.com/docs/12.x/billing)
- [Documentação do Stripe](https://stripe.com/docs)
- [Dashboard do Stripe](https://dashboard.stripe.com)
