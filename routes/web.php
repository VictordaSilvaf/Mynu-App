<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application.
|
*/

// Marketing & Public Routes
require __DIR__.'/marketing.php';

// Payment Routes
require __DIR__.'/payment.php';

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::middleware(['role:pro|enterprise'])->group(function () {
        Route::get('menus', function () {
            return Inertia::render('menus');
        })->name('menus');
    });

    Route::get('monthlyfee', function () {
        return Inertia::render('monthlyfee', [
            'plans' => config('plans')['plans'],
        ]);
    })->name('monthlyfee');
});

require __DIR__.'/settings.php';
require __DIR__.'/subscription.php';
