<?php

namespace App\DTO;

use Illuminate\Support\Carbon;

class MetricData
{
    public function __construct(
        public readonly int $totalAccess,
        public readonly int $activeProducts,
        public readonly int $createdMenus,
        public readonly ?Carbon $lastUpdate,
        public readonly array $mostAccessedProducts,
    ) {}
}
