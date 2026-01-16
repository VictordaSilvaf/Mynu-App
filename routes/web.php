<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'plans' => config('plans')['plans'],
    ]);
})->name('home');

Route::get('/payment/{plan}/{billing}/{price_id}', function ($plan, $billing, $price_id = null) {
    return Inertia::render('payment', [
        'canRegister' => Features::enabled(Features::registration()),
        'plan' => $plan,
        'billing' => $billing,
        'price_id' => $price_id,
    ]);
})->name('payment');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::middleware(['role:pro|enterprise'])->group(function () {
        Route::get('menus', function () {
            return Inertia::render('menus');
        })->name('menus');
    });

    Route::get('subscription', function () {
        return Inertia::render('subscription', [
            'plans' => config('plans'),
        ]);
    })->name('subscription');
});

require __DIR__.'/settings.php';
