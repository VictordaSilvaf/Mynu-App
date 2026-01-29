<?php

namespace App\Services;

use App\DTO\DashboardMetricsData;
use App\Models\Menu;
use App\Models\Store;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function __construct() {}

    public function getGlobalMetrics(): DashboardMetricsData
    {
        $totalUsers = User::count();
        $activeStores = Store::count(); // Assuming all stores are active for now
        $totalMenus = Menu::count();

        $activeSubscriptions = Subscription::where('stripe_status', 'active')
            ->orWhere('stripe_status', 'trialing')
            ->count();

        $canceledSubscriptions = Subscription::where('stripe_status', 'canceled')->count();

        $expiredSubscriptions = Subscription::where('ends_at', '<', Carbon::now())->count();

        $monthlyUserGrowth = $this->getMonthlyGrowth(new User, 'created_at');
        $monthlyStoreGrowth = $this->getMonthlyGrowth(new Store, 'created_at');
        $monthlyMenuGrowth = $this->getMonthlyGrowth(new Menu, 'created_at');
        $monthlySubscriptionGrowth = $this->getMonthlyGrowth(new Subscription, 'created_at');

        return new DashboardMetricsData(
            totalUsers: $totalUsers,
            activeStores: $activeStores,
            totalMenus: $totalMenus,
            activeSubscriptions: $activeSubscriptions,
            canceledSubscriptions: $canceledSubscriptions,
            expiredSubscriptions: $expiredSubscriptions,
            monthlyUserGrowth: $monthlyUserGrowth,
            monthlyStoreGrowth: $monthlyStoreGrowth,
            monthlyMenuGrowth: $monthlyMenuGrowth,
            monthlySubscriptionGrowth: $monthlySubscriptionGrowth,
        );
    }

    private function getMonthlyGrowth($model, string $dateColumn): array
    {
        return $model::query()
            ->select(DB::raw("DATE_FORMAT({$dateColumn}, '%Y-%m') as month"), DB::raw('count(*) as count'))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month')
            ->map(fn ($item) => $item['count'])
            ->toArray();
    }
}
