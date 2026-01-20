<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class CheckoutController extends Controller
{
    /**
     * Display payment checkout page.
     */
    public function show(Request $request, string $plan, string $billing, ?string $priceId = null): Response
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

        $amount = $billing === 'annual' ? $planData['yearlyPrice'] : $planData['monthlyPrice'];
        $amountInCents = (int) ($amount * 100);

        $user = $request->user();
        $clientSecret = null;

        try {
            if ($user) {
                if (! $user->hasStripeId()) {
                    $user->createAsStripeCustomer();
                }

                $paymentIntent = $user->pay(
                    $amountInCents,
                    [
                        'currency' => strtolower($planData['currency']),
                        'description' => "Assinatura {$planData['name']} - {$billing}",
                        'metadata' => [
                            'plan' => $plan,
                            'billing' => $billing,
                            'price_id' => $priceId ?? $planData['price_id'],
                        ],
                    ]
                );

                $clientSecret = $paymentIntent->client_secret;
            } else {
                $stripe = new \Stripe\StripeClient(config('cashier.secret'));

                $paymentIntent = $stripe->paymentIntents->create([
                    'amount' => $amountInCents,
                    'currency' => strtolower($planData['currency']),
                    'description' => "Assinatura {$planData['name']} - {$billing}",
                    'metadata' => [
                        'plan' => $plan,
                        'billing' => $billing,
                        'price_id' => $priceId ?? $planData['price_id'],
                    ],
                    'automatic_payment_methods' => [
                        'enabled' => true,
                    ],
                ]);

                $clientSecret = $paymentIntent->client_secret;
            }
        } catch (\Exception $e) {
            report($e);

            return Inertia::render('payment/cancelled', [
                'reason' => 'processing_error',
                'plan' => $plan,
                'billing' => $billing,
            ]);
        }

        return Inertia::render('payment/checkout', [
            'canRegister' => Features::enabled(Features::registration()),
            'plan' => $plan,
            'billing' => $billing,
            'price_id' => $priceId ?? $planData['price_id'],
            'clientSecret' => $clientSecret,
            'amount' => $amountInCents,
            'currency' => strtolower($planData['currency']),
        ]);
    }

    /**
     * Handle payment success.
     */
    public function success(Request $request): Response
    {
        $user = $request->user();
        $subscription = null;

        if ($user && $user->subscribed('default')) {
            $sub = $user->subscription('default');
            $subscription = [
                'id' => $sub->stripe_id,
                'plan' => $sub->stripe_price ?? 'unknown',
                'status' => $sub->stripe_status,
                'current_period_end' => $sub->ends_at?->toIso8601String(),
            ];
        }

        return Inertia::render('payment/success', [
            'plan' => $request->query('plan'),
            'billing' => $request->query('billing'),
            'subscription' => $subscription,
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
