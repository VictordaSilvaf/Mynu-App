<?php

namespace App\Policies;

use App\Models\Menu;
use App\Models\User;
use App\Services\Menu\MenuLimitService;

class MenuPolicy
{
        public function __construct(
        private MenuLimitService $menuLimitService
    ) {}

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Menu $menu): bool
    {
        return $user->hasRole('admin') || $menu->store->user_id === $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $this->menuLimitService->authorizeCreate($user);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Menu $menu): bool
    {
        return $user->hasRole('admin') || $menu->store->user_id === $user->id;
    }

    /**
     * Determine whether the user can edit sections and dishes (content) of this menu.
     * Free: only the first menu (by order). Pro/Enterprise/Admin: any menu they own.
     */
    public function editContent(User $user, Menu $menu): bool
    {
        if (! $this->update($user, $menu)) {
            return false;
        }

        if ($user->hasRole('admin') || $user->hasRole('pro') || $user->hasRole('enterprise')) {
            return true;
        }

        $firstMenu = $menu->store->menus()->orderBy('order')->first();

        return $firstMenu && $firstMenu->id === $menu->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Menu $menu): bool
    {
        return $user->hasRole('admin') || $menu->store->user_id === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Menu $menu): bool
    {
        return $user->hasRole('admin') || $menu->store->user_id === $user->id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Menu $menu): bool
    {
        return $user->hasRole('admin') || $menu->store->user_id === $user->id;
    }
}
