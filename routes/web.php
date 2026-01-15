<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

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
        return Inertia::render('subscription');
    })->name('subscription');
});

require __DIR__.'/settings.php';
