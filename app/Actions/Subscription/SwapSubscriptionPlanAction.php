<?php

namespace App\Actions\Subscription;

use App\DataTransferObjects\Subscription\PlanChangeData;
use App\Models\User;
use Laravel\Cashier\Subscription;

final class SwapSubscriptionPlanAction
{
    public function execute(User $user, PlanChangeData $data): Subscription
    {
        $subscription = $user->subscription($data->subscriptionName);

        if (! $subscription) {
            throw new \Exception("Subscription '{$data->subscriptionName}' not found.");
        }

        $swapBuilder = $subscription->swap($data->newPriceId);

        if (! $data->prorate) {
            $swapBuilder->noProrate();
        }

        if ($data->invoiceNow) {
            $swapBuilder->invoiceNow();
        }

        return $subscription->fresh();
    }
}
