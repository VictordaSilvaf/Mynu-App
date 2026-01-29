<?php

namespace App\Services\Menu;

use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

class MenuLimitService
{
    public function authorizeCreate(User $user): void
    {
        if ($user->hasRole('enterprise')) {
            return;
        }

        if ($user->hasRole('pro')) {
            if ($user->menus()->count() >= 5) {
                throw new AuthorizationException(
                    'Seu plano atual permite até 5 cardápios. Para criar mais, faça o upgrade do plano.'
                );
            }

            return;
        }

        throw new AuthorizationException(
            'Seu plano atual não permite a criação de cardápios.'
        );
    }
}
