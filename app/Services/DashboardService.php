<?php

namespace App\Services;

use App\DataTransferObjects\MetricData;
use App\Models\Store;
use App\Models\Visit;
use Illuminate\Support\Carbon;

class DashboardService
{
    public function __construct(
        private readonly Store $store,
        private readonly int $period = 7,
    ) {}

    public function getMetrics(): MetricData
    {
        return new MetricData(
            totalAccess: $this->getTotalAccess(),
            activeProducts: $this->getActiveProducts(),
            createdMenus: $this->getCreatedMenus(),
            lastUpdate: $this->getLastUpdate(),
            mostAccessedProducts: $this->getMostAccessedProducts(),
        );
    }

    private function getTotalAccess(): int
    {
        return $this->store->visits()->where('visited_at', '>=', Carbon::now()->subDays($this->period))->count();
    }

    private function getActiveProducts(): int
    {
        return $this->store->dishes()->where('is_active', true)->count();
    }

    private function getCreatedMenus(): int
    {
        return $this->store->menus()->where('created_at', '>=', Carbon::now()->subDays($this->period))->count();
    }

    private function getLastUpdate(): ?Carbon
    {
        $lastUpdate = $this->store->dishes()->max('updated_at');

        return $lastUpdate ? Carbon::parse($lastUpdate) : null;
    }

    private function getMostAccessedProducts(): array
    {
        return Visit::query()
            ->selectRaw('dish_id, count(*) as total')
            ->where('store_id', $this->store->id)
            ->where('visited_at', '>=', Carbon::now()->subDays($this->period))
            ->groupBy('dish_id')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->with('dish')
            ->get()
            ->toArray();
    }
}
