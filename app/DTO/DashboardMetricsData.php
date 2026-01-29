<?php

namespace App\DTO;

class DashboardMetricsData
{
    public function __construct(
        public readonly int $totalUsers,
        public readonly int $activeStores,
        public readonly int $totalMenus,
        public readonly int $activeSubscriptions,
        public readonly int $canceledSubscriptions,
        public readonly int $expiredSubscriptions,
        public readonly array $monthlyUserGrowth, // Array of month => count
        public readonly array $monthlyStoreGrowth, // Array of month => count
        public readonly array $monthlyMenuGrowth, // Array of month => count
        public readonly array $monthlySubscriptionGrowth, // Array of month => count
    ) {}
}
