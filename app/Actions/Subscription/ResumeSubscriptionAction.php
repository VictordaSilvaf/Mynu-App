<?php

namespace App\Actions\Subscription;

use App\Models\User;
use Laravel\Cashier\Subscription;

final class ResumeSubscriptionAction
{
    public function execute(User $user, string $subscriptionName = 'default'): Subscription
    {
        $subscription = $user->subscription($subscriptionName);

        if (! $subscription) {
            throw new \Exception("Subscription '{$subscriptionName}' not found.");
        }

        if (! $subscription->onGracePeriod()) {
            throw new \Exception('Subscription is not on grace period and cannot be resumed.');
        }

        $subscription->resume();

        return $subscription->fresh();
    }
}
