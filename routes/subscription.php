<?php

use App\Http\Controllers\Subscription\PaymentMethodController;
use App\Http\Controllers\Subscription\StripeWebhookController;
use App\Http\Controllers\Subscription\SubscriptionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('subscription')->name('subscription.')->group(function () {
    Route::get('/', [SubscriptionController::class, 'index'])->name('index');
    Route::get('/manage', [SubscriptionController::class, 'manage'])->name('manage');
    Route::post('/', [SubscriptionController::class, 'store'])->name('store');
    Route::post('/change-plan', [SubscriptionController::class, 'changePlan'])->name('change-plan');
    Route::post('/cancel', [SubscriptionController::class, 'cancel'])->name('cancel');
    Route::post('/resume', [SubscriptionController::class, 'resume'])->name('resume');
});

Route::middleware(['auth', 'verified'])->prefix('payment-methods')->name('payment-methods.')->group(function () {
    Route::get('/', [PaymentMethodController::class, 'index'])->name('index');
    Route::post('/', [PaymentMethodController::class, 'update'])->name('update');
    Route::delete('/{paymentMethodId}', [PaymentMethodController::class, 'destroy'])->name('destroy');
});

Route::post('/stripe/webhook', [StripeWebhookController::class, 'handleWebhook'])
    ->name('stripe.webhook')
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
