<?php

namespace App\Services;

use App\Actions\Subscription\CancelSubscriptionAction;
use App\Actions\Subscription\CreateStripeCustomerAction;
use App\Actions\Subscription\CreateSubscriptionAction;
use App\Actions\Subscription\ResumeSubscriptionAction;
use App\Actions\Subscription\SwapSubscriptionPlanAction;
use App\Actions\Subscription\UpdatePaymentMethodAction;
use App\DataTransferObjects\Subscription\PaymentMethodData;
use App\DataTransferObjects\Subscription\PlanChangeData;
use App\DataTransferObjects\Subscription\SubscriptionData;
use App\Models\User;
use Illuminate\Support\Collection;
use Laravel\Cashier\Exceptions\IncompletePayment;
use Laravel\Cashier\Subscription;

final class SubscriptionService
{
    public function __construct(
        private readonly CreateStripeCustomerAction $createStripeCustomer,
        private readonly CreateSubscriptionAction $createSubscription,
        private readonly UpdatePaymentMethodAction $updatePaymentMethod,
        private readonly CancelSubscriptionAction $cancelSubscription,
        private readonly SwapSubscriptionPlanAction $swapPlan,
        private readonly ResumeSubscriptionAction $resumeSubscription,
    ) {}

    /**
     * Create a new subscription for the user.
     *
     * @throws IncompletePayment
     */
    public function subscribe(User $user, SubscriptionData $data): Subscription
    {
        if ($this->hasActiveSubscription($user, $data->name)) {
            throw new \Exception("User already has an active subscription named '{$data->name}'.");
        }

        return $this->createSubscription->execute($user, $data);
    }

    /**
     * Check if user has an active subscription.
     */
    public function hasActiveSubscription(User $user, string $name = 'default'): bool
    {
        return $user->subscribed($name);
    }

    /**
     * Get user's subscription by name.
     */
    public function getSubscription(User $user, string $name = 'default'): ?Subscription
    {
        return $user->subscription($name);
    }

    /**
     * Get all user's subscriptions.
     *
     * @return Collection<int, Subscription>
     */
    public function getAllSubscriptions(User $user): Collection
    {
        return $user->subscriptions;
    }

    /**
     * Change subscription plan.
     */
    public function changePlan(User $user, PlanChangeData $data): Subscription
    {
        if (! $this->hasActiveSubscription($user, $data->subscriptionName)) {
            throw new \Exception("No active subscription found named '{$data->subscriptionName}'.");
        }

        return $this->swapPlan->execute($user, $data);
    }

    /**
     * Update payment method.
     */
    public function updatePaymentMethod(User $user, PaymentMethodData $data): User
    {
        if (! $user->hasStripeId()) {
            $this->createStripeCustomer->execute($user, $data->paymentMethodId);
        }

        return $this->updatePaymentMethod->execute($user, $data);
    }

    /**
     * Cancel subscription.
     */
    public function cancel(User $user, string $subscriptionName = 'default', bool $immediately = false): Subscription
    {
        if (! $this->hasActiveSubscription($user, $subscriptionName)) {
            throw new \Exception("No active subscription found named '{$subscriptionName}'.");
        }

        return $this->cancelSubscription->execute($user, $subscriptionName, $immediately);
    }

    /**
     * Resume a cancelled subscription.
     */
    public function resume(User $user, string $subscriptionName = 'default'): Subscription
    {
        return $this->resumeSubscription->execute($user, $subscriptionName);
    }

    /**
     * Check if subscription is on trial.
     */
    public function isOnTrial(User $user, string $subscriptionName = 'default'): bool
    {
        return $user->onTrial($subscriptionName);
    }

    /**
     * Check if subscription is on grace period.
     */
    public function isOnGracePeriod(User $user, string $subscriptionName = 'default'): bool
    {
        $subscription = $this->getSubscription($user, $subscriptionName);

        return $subscription?->onGracePeriod() ?? false;
    }

    /**
     * Get subscription status information.
     */
    public function getSubscriptionStatus(User $user, string $subscriptionName = 'default'): array
    {
        $subscription = $this->getSubscription($user, $subscriptionName);

        if (! $subscription) {
            return [
                'subscribed' => false,
                'on_trial' => false,
                'on_grace_period' => false,
                'cancelled' => false,
                'ends_at' => null,
            ];
        }

        return [
            'subscribed' => $subscription->active(),
            'on_trial' => $subscription->onTrial(),
            'on_grace_period' => $subscription->onGracePeriod(),
            'cancelled' => $subscription->cancelled(),
            'ends_at' => $subscription->ends_at?->toIso8601String(),
            'stripe_status' => $subscription->stripe_status,
        ];
    }

    /**
     * Ensure user is a Stripe customer.
     */
    public function ensureStripeCustomer(User $user, ?string $paymentMethod = null): User
    {
        return $this->createStripeCustomer->execute($user, $paymentMethod);
    }
}
