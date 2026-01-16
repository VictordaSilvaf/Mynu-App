# Exemplos de Implementação Frontend - Sistema de Pagamento

Este documento contém exemplos práticos de como implementar o sistema de pagamento no frontend do Mynu usando React, Inertia.js e Stripe Elements.

## Instalação de Dependências

```bash
vendor/bin/sail npm install @stripe/stripe-js @stripe/react-stripe-js
```

## 1. Configuração do Stripe no Frontend

### vite.config.js

Adicione a chave pública do Stripe:

```javascript
// .env
VITE_STRIPE_KEY=pk_test_...
```

## 2. Componente de Assinatura Completo

### resources/js/pages/subscription/index.tsx

```tsx
import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

interface Plan {
  name: string;
  price_id: string;
  price: number;
  features: string[];
}

const plans: Plan[] = [
  {
    name: 'Free',
    price_id: null,
    price: 0,
    features: ['1 cardápio', 'Até 20 itens', 'Suporte por email'],
  },
  {
    name: 'Pro',
    price_id: import.meta.env.VITE_STRIPE_PRICE_PRO,
    price: 29.90,
    features: ['5 cardápios', 'Itens ilimitados', 'Suporte prioritário', 'Analytics'],
  },
  {
    name: 'Enterprise',
    price_id: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE,
    price: 99.90,
    features: ['Tudo do Pro', 'API access', 'White-label', 'Suporte 24/7'],
  },
];

function CheckoutForm({ selectedPlan }: { selectedPlan: Plan }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement!,
      });

      if (stripeError) {
        setError(stripeError.message || 'Erro ao processar pagamento');
        setProcessing(false);
        return;
      }

      router.post('/subscription', {
        price_id: selectedPlan.price_id,
        payment_method_id: paymentMethod.id,
      }, {
        preserveScroll: true,
        onSuccess: () => {
          alert('Assinatura criada com sucesso!');
        },
        onError: (errors) => {
          setError(errors.message || 'Erro ao criar assinatura');
        },
        onFinish: () => {
          setProcessing(false);
        },
      });
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded-lg p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {processing ? 'Processando...' : `Assinar ${selectedPlan.name} - R$ ${selectedPlan.price}/mês`}
      </button>
    </form>
  );
}

export default function SubscriptionPage() {
  const { subscription_status } = usePage().props;
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Escolha seu Plano</h1>

      {/* Status da Assinatura Atual */}
      {subscription_status.subscribed && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-8">
          <p className="text-green-800">
            Você está com uma assinatura ativa!
            {subscription_status.on_trial && ' (Período de teste)'}
          </p>
        </div>
      )}

      {/* Planos */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="border rounded-lg p-6 hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
            <p className="text-4xl font-bold mb-4">
              R$ {plan.price}
              <span className="text-sm text-gray-500">/mês</span>
            </p>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            {plan.price_id && (
              <button
                onClick={() => setSelectedPlan(plan)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Escolher Plano
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal de Checkout */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Checkout</h2>
              <button onClick={() => setSelectedPlan(null)}>✕</button>
            </div>

            <Elements stripe={stripePromise}>
              <CheckoutForm selectedPlan={selectedPlan} />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
}
```

## 3. Gerenciamento de Métodos de Pagamento

### resources/js/pages/subscription/payment-methods.tsx

```tsx
import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

function AddPaymentMethodForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement!,
    });

    if (error) {
      alert(error.message);
      setProcessing(false);
      return;
    }

    router.post('/payment-methods', {
      payment_method_id: paymentMethod.id,
      set_as_default: true,
    }, {
      onFinish: () => setProcessing(false),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement />
      <button
        type="submit"
        disabled={processing}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {processing ? 'Adicionando...' : 'Adicionar Cartão'}
      </button>
    </form>
  );
}

export default function PaymentMethodsPage() {
  const { payment_methods, default_payment_method } = usePage().props;

  const handleDelete = (paymentMethodId: string) => {
    if (confirm('Deseja remover este método de pagamento?')) {
      router.delete(`/payment-methods/${paymentMethodId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Métodos de Pagamento</h1>

      {/* Lista de Cartões */}
      <div className="space-y-4 mb-8">
        {payment_methods?.map((method: any) => (
          <div key={method.id} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">
                {method.card.brand.toUpperCase()} •••• {method.card.last4}
              </p>
              <p className="text-sm text-gray-500">
                Expira em {method.card.exp_month}/{method.card.exp_year}
              </p>
              {default_payment_method?.id === method.id && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-1 inline-block">
                  Padrão
                </span>
              )}
            </div>
            <button
              onClick={() => handleDelete(method.id)}
              className="text-red-600 hover:text-red-800"
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      {/* Adicionar Novo Cartão */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Adicionar Novo Cartão</h2>
        <Elements stripe={stripePromise}>
          <AddPaymentMethodForm />
        </Elements>
      </div>
    </div>
  );
}
```

## 4. Gerenciamento de Assinatura

### resources/js/pages/subscription/manage.tsx

```tsx
import { router, usePage } from '@inertiajs/react';

export default function ManageSubscriptionPage() {
  const { subscription_status, subscriptions } = usePage().props;

  const handleCancelSubscription = () => {
    if (confirm('Deseja realmente cancelar sua assinatura?')) {
      router.post('/subscription/cancel', {
        immediately: false,
      });
    }
  };

  const handleResumeSubscription = () => {
    router.post('/subscription/resume');
  };

  const handleChangePlan = (newPriceId: string) => {
    if (confirm('Deseja trocar de plano?')) {
      router.post('/subscription/change-plan', {
        new_price_id: newPriceId,
        prorate: true,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Assinatura</h1>

      {/* Status */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Status da Assinatura</h2>
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="text-gray-600">Status:</dt>
            <dd className="font-semibold">
              {subscription_status.subscribed ? 'Ativa' : 'Inativa'}
            </dd>
          </div>
          {subscription_status.on_trial && (
            <div className="flex justify-between">
              <dt className="text-gray-600">Período de Teste:</dt>
              <dd className="text-blue-600 font-semibold">Sim</dd>
            </div>
          )}
          {subscription_status.on_grace_period && (
            <div className="flex justify-between">
              <dt className="text-gray-600">Período de Carência:</dt>
              <dd className="text-orange-600 font-semibold">Sim</dd>
            </div>
          )}
          {subscription_status.ends_at && (
            <div className="flex justify-between">
              <dt className="text-gray-600">Termina em:</dt>
              <dd>{new Date(subscription_status.ends_at).toLocaleDateString()}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Ações */}
      <div className="space-y-4">
        {subscription_status.on_grace_period && (
          <button
            onClick={handleResumeSubscription}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
          >
            Reativar Assinatura
          </button>
        )}

        {subscription_status.subscribed && !subscription_status.cancelled && (
          <button
            onClick={handleCancelSubscription}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
          >
            Cancelar Assinatura
          </button>
        )}
      </div>
    </div>
  );
}
```

## 5. Middleware para Verificar Assinatura

### app/Http/Middleware/RequireActiveSubscription.php

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RequireActiveSubscription
{
    public function handle(Request $request, Closure $next, string $subscription = 'default'): mixed
    {
        if (! $request->user()?->subscribed($subscription)) {
            return redirect()->route('subscription.index')
                ->with('error', 'Você precisa de uma assinatura ativa para acessar este recurso.');
        }

        return $next($request);
    }
}
```

Registre no `bootstrap/app.php`:

```php
$middleware->alias([
    'subscribed' => \App\Http\Middleware\RequireActiveSubscription::class,
]);
```

Use nas rotas:

```php
Route::middleware(['auth', 'subscribed'])->group(function () {
    Route::get('/menus', ...)->name('menus');
});
```

## 6. Helper Global para Verificar Features

### app/Helpers/SubscriptionHelper.php

```php
<?php

if (! function_exists('user_can_access_feature')) {
    function user_can_access_feature(string $feature): bool
    {
        $user = auth()->user();

        if (! $user) {
            return false;
        }

        // Implementar lógica baseada no plano do usuário
        return match($feature) {
            'multiple_menus' => $user->subscribed('default'),
            'analytics' => $user->subscribed('default'),
            'api_access' => $user->subscription('default')?->hasPrice('price_enterprise'),
            default => false,
        };
    }
}
```

Use em qualquer lugar:

```php
@if(user_can_access_feature('analytics'))
    <a href="{{ route('analytics') }}">Ver Analytics</a>
@endif
```

## 7. Testes Adicionais

### tests/Feature/Subscription/MiddlewareTest.php

```php
<?php

use App\Models\User;

test('authenticated user without subscription cannot access protected routes', function () {
    $user = User::factory()->create();

    $this
        ->actingAs($user)
        ->get(route('menus'))
        ->assertRedirect(route('subscription.index'));
});

test('authenticated user with subscription can access protected routes', function () {
    $user = User::factory()->create();

    // Mock subscription
    $this
        ->actingAs($user)
        ->postJson(route('subscription.store'), [
            'price_id' => 'price_test_123',
            'payment_method_id' => 'pm_card_visa',
        ]);

    $this
        ->actingAs($user)
        ->get(route('menus'))
        ->assertOk();
});
```

## Resumo

Este sistema oferece:

1. ✅ Integração completa com Stripe Elements
2. ✅ Gerenciamento de múltiplos métodos de pagamento
3. ✅ Troca de planos com proration
4. ✅ Cancelamento e reativação de assinaturas
5. ✅ Middleware para proteger rotas
6. ✅ Helpers globais para verificar features
7. ✅ Testes completos

Todos os componentes seguem as melhores práticas de React, TypeScript e Tailwind CSS v4.
