<?php

namespace App\Http\Controllers\Subscription;

use App\DTO\Subscription\PlanChangeData;
use App\DTO\Subscription\SubscriptionData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Subscription\CancelSubscriptionRequest;
use App\Http\Requests\Subscription\ChangePlanRequest;
use App\Http\Requests\Subscription\CreateSubscriptionRequest;
use App\Services\SubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Cashier\Exceptions\IncompletePayment;

class SubscriptionController extends Controller
{
    public function __construct(
        private readonly SubscriptionService $subscriptionService,
    ) {}

    /**
     * Display subscription management page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $plans = config('plans.plans');
        $subscriptions = $this->subscriptionService->getAllSubscriptions($user)
            ->map(function ($subscription) use ($plans) {
                $planName = null;

                foreach ($plans as $plan) {
                    $monthlyMatch = isset($plan['price_id_monthly']) && $plan['price_id_monthly'] === $subscription->stripe_price;
                    $yearlyMatch = isset($plan['price_id_yearly']) && $plan['price_id_yearly'] === $subscription->stripe_price;
                    $defaultMatch = isset($plan['price_id']) && $plan['price_id'] === $subscription->stripe_price;

                    if ($monthlyMatch || $yearlyMatch || $defaultMatch) {
                        $planName = $plan['name'] ?? null;
                        break;
                    }
                }

                $nextBillingAt = $subscription->trial_ends_at ?? $subscription->ends_at;

                if (! $nextBillingAt && ! app()->environment('testing')) {
                    try {
                        $stripeSubscription = $subscription->asStripeSubscription();

                        if (! empty($stripeSubscription->current_period_end)) {
                            $nextBillingAt = Carbon::createFromTimestamp(
                                $stripeSubscription->current_period_end
                            );
                        }
                    } catch (\Throwable) {
                        $nextBillingAt = null;
                    }
                }

                $resolvedPlanName = $planName ?? $subscription->type ?? 'Plano';

                return [
                    'id' => $subscription->id,
                    'plan_name' => Str::title(str_replace('_', ' ', $resolvedPlanName)),
                    'next_billing_date' => $nextBillingAt?->toIso8601String(),
                ];
            })
            ->values();

        return Inertia::render('subscription/index', [
            'subscriptions' => $subscriptions,
            'subscription_status' => $this->subscriptionService->getSubscriptionStatus($user),
            'has_payment_method' => $user->hasDefaultPaymentMethod(),
        ]);
    }

    /**
     * Display detailed subscription management page.
     */
    public function manage(Request $request): Response
    {
        $user = $request->user();
        $subscription = $user->subscription('default');
        $plans = config('plans.plans');

        // Get current plan
        $currentPlan = null;
        $currentPlanKey = null;
        if ($subscription) {
            $priceId = $subscription->stripe_price;
            foreach ($plans as $key => $plan) {
                $monthlyMatch = isset($plan['price_id_monthly']) && $plan['price_id_monthly'] === $priceId;
                $yearlyMatch = isset($plan['price_id_yearly']) && $plan['price_id_yearly'] === $priceId;
                $defaultMatch = isset($plan['price_id']) && $plan['price_id'] === $priceId;

                if ($monthlyMatch || $yearlyMatch || $defaultMatch) {
                    $currentPlan = $plan;
                    $currentPlanKey = $key;
                    break;
                }
            }
        }

        // Get available plans (excluding current)
        $availablePlans = array_filter($plans, function ($plan, $key) use ($currentPlanKey) {
            return $key !== $currentPlanKey && ! ($plan['isFree'] ?? false);
        }, ARRAY_FILTER_USE_BOTH);

        // Get invoices
        $invoices = $user->invoices()->map(function ($invoice) {
            return [
                'id' => $invoice->id,
                'date' => $invoice->date()->toIso8601String(),
                'amount' => (int) $invoice->total() / 100,
                'status' => $invoice->status,
                'invoice_pdf' => $invoice->invoice_pdf ?? null,
            ];
        })->take(10)->toArray();

        return Inertia::render('subscription/manage', [
            'subscription' => $subscription,
            'subscription_status' => $this->subscriptionService->getSubscriptionStatus($user),
            'current_plan' => $currentPlan,
            'available_plans' => $availablePlans,
            'has_payment_method' => $user->hasDefaultPaymentMethod(),
            'invoices' => $invoices,
        ]);
    }

    /**
     * Create a new subscription.
     */
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
            return response()->json([
                'message' => 'O pagamento requer ação adicional.',
                'payment_intent' => $e->payment->id,
                'redirect_url' => route('cashier.payment', [
                    $e->payment->id,
                    'redirect' => route('subscription.index'),
                ]),
            ], 402);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Change subscription plan.
     */
    public function changePlan(ChangePlanRequest $request): JsonResponse
    {
        try {
            $planChangeData = PlanChangeData::fromRequest($request->validated());

            $subscription = $this->subscriptionService->changePlan(
                $request->user(),
                $planChangeData
            );

            return response()->json([
                'message' => 'Plano alterado com sucesso!',
                'subscription' => $subscription,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Cancel subscription.
     */
    public function cancel(CancelSubscriptionRequest $request): JsonResponse
    {
        try {
            $subscription = $this->subscriptionService->cancel(
                $request->user(),
                $request->input('subscription_name', 'default'),
                $request->boolean('immediately')
            );

            return response()->json([
                'message' => 'Assinatura cancelada com sucesso!',
                'subscription' => $subscription,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Resume subscription.
     */
    public function resume(Request $request): JsonResponse
    {
        try {
            $subscription = $this->subscriptionService->resume(
                $request->user(),
                $request->input('subscription_name', 'default')
            );

            return response()->json([
                'message' => 'Assinatura reativada com sucesso!',
                'subscription' => $subscription,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
