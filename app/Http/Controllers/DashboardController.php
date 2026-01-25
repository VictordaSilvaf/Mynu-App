<?php

namespace App\Http\Controllers;

use App\Http\Requests\DashboardRequest;
use App\Services\DashboardService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(DashboardRequest $request): Response
    {
        $store = $request->user()->store;

        if (! $store) {
            return Inertia::render('dashboard', [
                'metrics' => [],
            ]);
        }

        $metrics = (new DashboardService($store, $request->get('period', 7)))->getMetrics();

        return Inertia::render('dashboard', [
            'metrics' => $metrics,
        ]);
    }
}
