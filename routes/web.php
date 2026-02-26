<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DishController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\PublicMenuController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application.
|
*/

// Admin Routes
require __DIR__.'/admin.php';

// Marketing & Public Routes
require __DIR__.'/marketing.php';

// Payment Routes
require __DIR__.'/payment.php';

// Subscription Routes
require __DIR__.'/subscription.php';

Route::get('cardapio/{menu}', [PublicMenuController::class, 'show'])->name('public.menu.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::post('menus/reorder', [MenuController::class, 'reorder'])->name('menus.reorder')->middleware(['hasAccessToMenu']);

    Route::post('menus/{menu}/duplicate', [MenuController::class, 'duplicate'])->name('menus.duplicate')->middleware(['hasAccessToMenu']);

    Route::resource('menus', MenuController::class)->middleware(['hasAccessToMenu'])->names([
        'index' => 'menus.index',
        'store' => 'menus.store',
        'show' => 'menus.show',
        'update' => 'menus.update',
    ]);

    Route::resource('stores', StoreController::class)->only(['index', 'store', 'update']);

    Route::middleware(['role:pro|enterprise'])->group(function () {
        Route::post('sections/reorder', [SectionController::class, 'reorder'])->name('sections.reorder');
        Route::resource('sections', SectionController::class)->only(['store', 'update', 'destroy']);
        Route::resource('dishes', DishController::class)->only(['store', 'update', 'destroy']);
    });
});

require __DIR__.'/settings.php';
