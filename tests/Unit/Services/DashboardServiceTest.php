<?php

namespace Tests\Unit\Services;

use App\Models\Dish;
use App\Models\Menu;
use App\Models\Store;
use App\Models\User;
use App\Models\Visit;
use App\Services\StoreDashboardService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class DashboardServiceTest extends TestCase
{
    use RefreshDatabase;

    private Store $store;

    protected function setUp(): void
    {
        parent::setUp();

        $this->store = Store::factory()->for(User::factory())->create();
    }

    public function test_it_gets_the_correct_metrics(): void
    {
        $this->createTestData();

        $service = new StoreDashboardService($this->store);
        $metrics = $service->getMetrics();

        $this->assertEquals(2, $metrics->totalAccess);
        $this->assertEquals(2, $metrics->activeProducts);
        $this->assertEquals(1, $metrics->createdMenus);
        $this->assertNotNull($metrics->lastUpdate);
        $this->assertCount(2, $metrics->mostAccessedProducts);
    }

    private function createTestData(): void
    {
        Menu::factory()->for($this->store)->create();
        $dishes = Dish::factory()->for($this->store)->count(2)->create(['is_active' => true]);
        Dish::factory()->for($this->store)->count(3)->create(['is_active' => false]);
        Visit::factory()->for($this->store)->for($dishes[0])->create(['visited_at' => Carbon::now()]);
        Visit::factory()->for($this->store)->for($dishes[1])->create(['visited_at' => Carbon::now()]);
    }
}
