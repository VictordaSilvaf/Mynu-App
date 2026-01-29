<?php

namespace App\Actions\Subscription;

use App\DTO\Subscription\SubscriptionData;
use App\Models\User;
use Laravel\Cashier\Subscription;

final class CreateSubscriptionAction
{
    public function __construct(
        private readonly CreateStripeCustomerAction $createStripeCustomer,
    ) {}

    public function execute(User $user, SubscriptionData $data): Subscription
    {
        $this->createStripeCustomer->execute($user, $data->paymentMethodId);

        $subscriptionBuilder = $user
            ->newSubscription($data->name, $data->priceId)
            ->quantity($data->quantity);

        if ($data->metadata) {
            $subscriptionBuilder->metadata($data->metadata->toArray());
        }

        if ($data->skipTrial) {
            $subscriptionBuilder->skipTrial();
        }

        return $subscriptionBuilder->create($data->paymentMethodId);
    }
}
