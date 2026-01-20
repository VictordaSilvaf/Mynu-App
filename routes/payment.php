<?php

use App\Http\Controllers\Payment\CheckoutController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Payment Routes
|--------------------------------------------------------------------------
|
| Rotas relacionadas ao fluxo de pagamento e checkout.
|
*/
// Checkout page
Route::get('payment/{plan}/{billing}/{price_id?}', [CheckoutController::class, 'show'])->name('payment.checkout');

// Payment success callback
Route::get('payment/success', [CheckoutController::class, 'success'])->name('payment.success');

// Payment cancelled/failed callback
Route::get('payment/cancelled', [CheckoutController::class, 'cancelled'])->name('payment.cancelled');

// Payment processing (3D Secure)
Route::get('payment/processing', [CheckoutController::class, 'processing'])->name('payment.processing');
