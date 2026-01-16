# Arquitetura do Sistema de Pagamento - Mynu

## Visão Geral

Este documento descreve a arquitetura completa do sistema de pagamento implementado no Mynu, seguindo princípios de Clean Code, SOLID e separação de responsabilidades.

## Princípios Arquiteturais

### 1. Single Responsibility Principle (SRP)
Cada classe tem uma única responsabilidade:
- **Actions**: Executam uma única operação específica
- **Services**: Orquestram múltiplas actions e contêm lógica de negócio
- **Controllers**: Apenas validam requisições e delegam para services
- **DTOs**: Apenas transportam dados entre camadas

### 2. Dependency Injection
Todas as dependências são injetadas via construtor:
```php
public function __construct(
    private readonly CreateStripeCustomerAction $createStripeCustomer,
    private readonly CreateSubscriptionAction $createSubscription,
) {}
```

### 3. Type Safety
- DTOs são readonly e tipados
- Todos os métodos têm type hints de retorno
- Uso de enums e tipos específicos

## Fluxo de Dados

```
Frontend (React + Stripe Elements)
        ↓
HTTP Request (JSON)
        ↓
Form Request (Validação)
        ↓
Controller (Delegação)
        ↓
DTO (Transformação de dados)
        ↓
Service (Lógica de negócio)
        ↓
Actions (Operações atômicas)
        ↓
Laravel Cashier / Stripe API
        ↓
Database
```

## Camadas da Aplicação

### 1. Presentation Layer (Controllers)

**Responsabilidade**: Receber requisições HTTP, validar e retornar respostas

```
app/Http/Controllers/Subscription/
├── SubscriptionController.php      # Gerenciamento de assinaturas
├── PaymentMethodController.php     # Gerenciamento de métodos de pagamento
└── StripeWebhookController.php     # Processamento de webhooks
```

**Características**:
- Enxutos (apenas validação e delegação)
- Usam Form Requests para validação
- Retornam JSON responses
- Não contêm lógica de negócio

### 2. Application Layer (Services)

**Responsabilidade**: Orquestrar actions e conter lógica de negócio

```
app/Services/
└── SubscriptionService.php
```

**Métodos principais**:
- `subscribe()` - Criar assinatura
- `cancel()` - Cancelar assinatura
- `resume()` - Reativar assinatura
- `changePlan()` - Trocar plano
- `getSubscriptionStatus()` - Obter status
- `hasActiveSubscription()` - Verificar assinatura ativa

### 3. Domain Layer (Actions)

**Responsabilidade**: Executar operações atômicas e reutilizáveis

```
app/Actions/Subscription/
├── CreateStripeCustomerAction.php      # Criar cliente no Stripe
├── CreateSubscriptionAction.php        # Criar assinatura
├── UpdatePaymentMethodAction.php       # Atualizar método de pagamento
├── CancelSubscriptionAction.php        # Cancelar assinatura
├── SwapSubscriptionPlanAction.php      # Trocar plano
└── ResumeSubscriptionAction.php        # Reativar assinatura
```

**Características**:
- Fazem apenas uma coisa
- São reutilizáveis
- Podem ser testadas isoladamente
- Injetam apenas dependências necessárias

### 4. Data Transfer Layer (DTOs)

**Responsabilidade**: Transportar dados entre camadas com type safety

```
app/DataTransferObjects/Subscription/
├── SubscriptionData.php        # Dados para criar assinatura
├── PlanChangeData.php          # Dados para trocar plano
└── PaymentMethodData.php       # Dados de método de pagamento
```

**Características**:
- São readonly
- Têm método `fromRequest()` para criar a partir de array
- Têm método `toArray()` para serialização
- Garantem type safety

### 5. Validation Layer (Form Requests)

**Responsabilidade**: Validar dados de entrada

```
app/Http/Requests/Subscription/
├── CreateSubscriptionRequest.php
├── UpdatePaymentMethodRequest.php
├── ChangePlanRequest.php
└── CancelSubscriptionRequest.php
```

**Características**:
- Validam dados antes de chegar ao controller
- Contêm mensagens de erro customizadas
- Seguem padrão array-based validation

### 6. Infrastructure Layer (Jobs)

**Responsabilidade**: Processar webhooks do Stripe de forma assíncrona

```
app/Jobs/Stripe/
├── HandleInvoicePaid.php
├── HandleInvoicePaymentFailed.php
├── HandleCustomerSubscriptionCreated.php
├── HandleCustomerSubscriptionUpdated.php
└── HandleCustomerSubscriptionDeleted.php
```

**Características**:
- Implementam `ShouldQueue`
- Processam eventos de forma assíncrona
- Fazem log automático
- Podem ser estendidos com lógica customizada

## Padrões de Design Utilizados

### 1. Service Pattern
```php
// Service orquestra actions e contém lógica de negócio
class SubscriptionService
{
    public function subscribe(User $user, SubscriptionData $data): Subscription
    {
        if ($this->hasActiveSubscription($user, $data->name)) {
            throw new \Exception("Already subscribed");
        }

        return $this->createSubscription->execute($user, $data);
    }
}
```

### 2. Action Pattern
```php
// Action faz apenas uma coisa
class CreateStripeCustomerAction
{
    public function execute(User $user, ?string $paymentMethod = null): User
    {
        if ($user->hasStripeId()) {
            return $user;
        }

        $user->createAsStripeCustomer([...]);
        return $user->fresh();
    }
}
```

### 3. DTO Pattern
```php
// DTO transporta dados com type safety
final readonly class SubscriptionData
{
    public function __construct(
        public string $priceId,
        public string $paymentMethodId,
        public ?string $name = 'default',
    ) {}

    public static function fromRequest(array $data): self { ... }
}
```

### 4. Repository Pattern (via Eloquent)
```php
// Service usa Eloquent como repository
$subscription = $user->subscription('default');
$subscriptions = $user->subscriptions;
```

## Tratamento de Erros

### 1. Erros Esperados
```php
try {
    $subscription = $service->subscribe($user, $data);
} catch (IncompletePayment $e) {
    // Pagamento requer 3D Secure
    return redirect()->route('cashier.payment', [$e->payment->id]);
} catch (\Exception $e) {
    // Outros erros (duplicação, etc.)
    return response()->json(['message' => $e->getMessage()], 422);
}
```

### 2. Logs Automáticos
Todos os Jobs de webhook fazem log automático:
```php
Log::info('Subscription created successfully', [
    'user_id' => $user->id,
    'subscription_id' => $subscription['id'],
]);
```

## Segurança

### 1. Validação de Webhooks
```php
// Webhooks são validados automaticamente pelo Cashier
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handleWebhook'])
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
```

### 2. Autenticação Obrigatória
```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/subscription', ...);
});
```

### 3. Type Safety
```php
// DTOs garantem que apenas dados válidos sejam processados
$subscriptionData = SubscriptionData::fromRequest($request->validated());
```

## Testes

### 1. Feature Tests
- Testam fluxos completos (criação, cancelamento, etc.)
- Usam factories para criar dados de teste
- Verificam responses e estado do banco

### 2. Estrutura de Testes
```
tests/Feature/Subscription/
├── SubscriptionTest.php      # Testes de assinatura
├── PaymentMethodTest.php     # Testes de métodos de pagamento
└── WebhookTest.php           # Testes de webhooks
```

## Configuração

### 1. Variáveis de Ambiente
```env
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ENTERPRISE=price_...

SUBSCRIPTION_TRIAL_DAYS=14
SUBSCRIPTION_GRACE_DAYS=3
```

### 2. Arquivo de Configuração
```php
// config/plans.php
return [
    'plans' => [...],
    'trial_days' => env('SUBSCRIPTION_TRIAL_DAYS', 14),
];
```

## Benefícios da Arquitetura

### 1. Manutenibilidade
- Código organizado e fácil de entender
- Separação clara de responsabilidades
- Fácil localizar e corrigir bugs

### 2. Testabilidade
- Actions podem ser testadas isoladamente
- Services podem ser mockados facilmente
- DTOs garantem dados consistentes

### 3. Escalabilidade
- Fácil adicionar novos planos
- Fácil adicionar novas features
- Fácil adicionar novos webhooks

### 4. Reutilização
- Actions podem ser usadas em múltiplos contextos
- DTOs podem ser usados em diferentes camadas
- Services podem ser injetados em qualquer lugar

### 5. Type Safety
- DTOs garantem tipos corretos
- Type hints previnem bugs
- IDE autocomplete funciona perfeitamente

## Extensibilidade

### Adicionar Novo Plano
1. Criar produto no Stripe
2. Adicionar em `config/plans.php`
3. Usar o mesmo fluxo existente

### Adicionar Nova Feature
1. Criar Action se necessário
2. Adicionar método ao Service
3. Criar endpoint no Controller
4. Adicionar testes

### Adicionar Novo Webhook
1. Criar Job em `app/Jobs/Stripe/`
2. Adicionar método em `StripeWebhookController`
3. Registrar no Stripe Dashboard

## Conclusão

Esta arquitetura oferece:

✅ **Clean Code**: Código limpo e fácil de entender
✅ **SOLID**: Princípios SOLID aplicados em todas as camadas
✅ **Separação de Responsabilidades**: Cada classe tem um propósito único
✅ **Type Safety**: Tipos garantidos em toda aplicação
✅ **Testabilidade**: Fácil escrever e manter testes
✅ **Escalabilidade**: Fácil adicionar novas features
✅ **Manutenibilidade**: Fácil corrigir e atualizar código

O sistema está pronto para produção e pode ser facilmente estendido conforme as necessidades do Mynu crescem.
