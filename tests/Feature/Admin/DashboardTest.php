<?php

use App\Models\Menu;
use App\Models\Store;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Carbon;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

// use Illuminate\Support\Facades\Vite; // No longer needed

beforeEach(function () {
    // Ensure the 'admin' role exists
    Role::findOrCreate('admin');

    // Disable Vite for this test
    $this->withoutVite();
});

it('redirects non-admin users', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.dashboard.index'))
        ->assertForbidden(); // Assuming a 403 Forbidden for non-admins
});

it('displays global metrics to admin users', function () {
    $admin = User::factory()->create()->assignRole('admin');

    // Create some dummy data
    User::factory()->count(10)->create();
    Store::factory()->count(5)->create();
    Menu::factory()->count(15)->create();

    Subscription::factory()->create(['stripe_status' => 'active']);
    Subscription::factory()->create(['stripe_status' => 'trialing']);
    Subscription::factory()->create(['stripe_status' => 'canceled']);
    Subscription::factory()->create(['ends_at' => Carbon::yesterday()]); // Expired

    // Monthly growth data (simplified for test, real implementation will be more complex)
    Subscription::factory()->create(['created_at' => Carbon::now()->subMonths(1)]);
    User::factory()->create(['created_at' => Carbon::now()->subMonths(1)]);
    Store::factory()->create(['created_at' => Carbon::now()->subMonths(1)]);
    Menu::factory()->create(['created_at' => Carbon::now()->subMonths(1)]);

    $expectedTotalUsers = User::count();
    $expectedActiveStores = Store::count();
    $expectedTotalMenus = Menu::count();

    $expectedActiveSubscriptions = Subscription::where('stripe_status', 'active')
        ->orWhere('stripe_status', 'trialing')
        ->count();
    $expectedCanceledSubscriptions = Subscription::where('stripe_status', 'canceled')->count();
    $expectedExpiredSubscriptions = Subscription::where('ends_at', '<', Carbon::now())->count();

    $this->actingAs($admin)
        ->get(route('admin.dashboard.index'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('admin/dashboard/index')
                ->has('metrics', fn (Assert $page) => $page
                    ->where('totalUsers', $expectedTotalUsers)
                    ->where('activeStores', $expectedActiveStores)
                    ->where('totalMenus', $expectedTotalMenus)
                    ->where('activeSubscriptions', $expectedActiveSubscriptions)
                    ->where('canceledSubscriptions', $expectedCanceledSubscriptions)
                    ->where('expiredSubscriptions', $expectedExpiredSubscriptions)
                    ->has('monthlyUserGrowth')
                    ->has('monthlyStoreGrowth')
                    ->has('monthlyMenuGrowth')
                    ->has('monthlySubscriptionGrowth')
                    ->etc()
                )
        );
});
