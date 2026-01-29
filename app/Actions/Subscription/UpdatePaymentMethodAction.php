<?php

namespace App\Actions\Subscription;

use App\DTO\Subscription\PaymentMethodData;
use App\Models\User;

final class UpdatePaymentMethodAction
{
    public function execute(User $user, PaymentMethodData $data): User
    {
        $user->updateDefaultPaymentMethod($data->paymentMethodId);

        if ($data->setAsDefault) {
            $user->updateDefaultPaymentMethodFromStripe();
        }

        return $user->fresh();
    }
}
