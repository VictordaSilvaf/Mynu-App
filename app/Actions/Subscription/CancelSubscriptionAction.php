<?php

namespace App\Actions\Subscription;

use App\Models\User;
use Laravel\Cashier\Subscription;

final class CancelSubscriptionAction
{
    public function execute(User $user, string $subscriptionName = 'default', bool $immediately = false): Subscription
    {
        $subscription = $user->subscription($subscriptionName);

        if (! $subscription) {
            throw new \Exception("Subscription '{$subscriptionName}' not found.");
        }

        if ($immediately) {
            $subscription->cancelNow();
        } else {
            $subscription->cancel();
        }

        return $subscription->fresh();
    }
}
