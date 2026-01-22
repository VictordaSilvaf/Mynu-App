<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Cashier\Checkout;

class CheckoutController extends Controller
{
    /**
     * Display payment checkout page.
     */
    public function show(Request $request, string $plan, string $billing, ?string $priceId = null): Response|Checkout|RedirectResponse
    {
        $plans = config('plans.plans');

        if (! isset($plans[$plan])) {
            abort(404, 'Plano não encontrado');
        }

        $planData = $plans[$plan];

        if ($planData['isFree']) {
            return Inertia::render('payment/cancelled', [
                'reason' => 'user_cancelled',
                'plan' => $plan,
                'billing' => $billing,
            ]);
        }

        $user = $request->user();

        // Redireciona para Stripe Checkout usando Cashier
        if ($user) {
            if (! $user->hasStripeId()) {
                $user->createAsStripeCustomer();
            }

            // Determina o price ID correto baseado no billing
            $stripePriceId = $billing === 'annual'
                ? ($planData['price_id_yearly'] ?? $planData['price_id'])
                : ($planData['price_id_monthly'] ?? $planData['price_id']);

            // Se foi passado um priceId explícito na URL, usa ele (mas valida se é price_ e não prod_)
            if ($priceId && str_starts_with($priceId, 'price_')) {
                $stripePriceId = $priceId;
            }

            return $user->newSubscription('default', $stripePriceId)
                ->trialDays(config('plans.trial_days', 0))
                ->checkout([
                    'success_url' => route('payment.success', [
                        'plan' => $plan,
                        'billing' => $billing,
                    ]),
                    'cancel_url' => route('payment.cancelled', [
                        'reason' => 'user_cancelled',
                        'plan' => $plan,
                        'billing' => $billing,
                    ]),
                ]);
        }

        // Para usuários não autenticados, redireciona para login
        return redirect()->route('login');
    }

    /**
     * Handle payment success.
     */
    public function success(Request $request): Response
    {
        $user = $request->user();

        // Se ainda não tem assinatura no banco, passamos um estado de 'pending'
        $sub = $user->subscription('default');

        $subscriptionData = $sub ? [
            'id' => $sub->stripe_id,
            'plan' => $sub->stripe_price,
            'status' => $sub->stripe_status,
            'current_period_end' => $sub->ends_at?->toIso8601String(),
        ] : null;

        return Inertia::render('payment/success', [
            'plan' => $request->query('plan'),
            'billing' => $request->query('billing'),
            'subscription' => $subscriptionData,
            'is_processing' => is_null($subscriptionData), // Nova prop para o React
        ]);
    }

    /**
     * Handle payment cancellation.
     */
    public function cancelled(Request $request): Response
    {
        return Inertia::render('payment/cancelled', [
            'reason' => $request->query('reason', 'payment_failed'),
            'plan' => $request->query('plan'),
            'billing' => $request->query('billing'),
        ]);
    }

    /**
     * Handle payment processing (3D Secure).
     */
    public function processing(Request $request): Response
    {
        return Inertia::render('payment/processing', [
            'payment_intent_id' => $request->query('payment_intent'),
            'setup_intent_id' => $request->query('setup_intent'),
            'return_url' => $request->query('return_url'),
        ]);
    }
}
