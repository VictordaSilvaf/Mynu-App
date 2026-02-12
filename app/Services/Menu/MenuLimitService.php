<?php

namespace App\Services\Menu;

use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

class MenuLimitService
{
    public function authorizeCreate(User $user)
    {
        if ($user->hasRole('enterprise')) {
            return true;
        }

        if ($user->hasRole('pro')) {
            if ($user->menus()->count() >= 5) {
                throw new AuthorizationException(
                    'Seu plano atual permite até 5 cardápios. Para criar mais, faça o upgrade do plano.'
                );
            }

            return true;
        }

        if ($user->menus()->count() >= 1) {
            throw new AuthorizationException(
                'Seu plano atual não permite a criação de novos cardápios.'
            );
        }

        return true;
    }
}
