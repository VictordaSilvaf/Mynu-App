<?php

namespace App\Actions\Subscription;

use App\Models\User;

final class CreateStripeCustomerAction
{
    public function execute(User $user, ?string $paymentMethod = null): User
    {
        if ($user->hasStripeId()) {
            return $user;
        }

        $options = [
            'name' => $user->name,
            'email' => $user->email,
        ];

        if ($paymentMethod) {
            $options['payment_method'] = $paymentMethod;
            $options['invoice_settings'] = [
                'default_payment_method' => $paymentMethod,
            ];
        }

        $user->createAsStripeCustomer($options);

        return $user->fresh();
    }
}
