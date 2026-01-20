<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

/*
|--------------------------------------------------------------------------
| Marketing & Public Routes
|--------------------------------------------------------------------------
|
| Rotas públicas para páginas de marketing, captação de clientes
| e informações sobre o produto.
|
*/

// Home page
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'plans' => config('plans.plans'),
    ]);
})->name('home');

// Pricing page
Route::get('/pricing', function () {
    return Inertia::render('marketing/pricing', [
        'plans' => config('plans.plans'),
    ]);
})->name('pricing');

// Features page
Route::get('/features', function () {
    return Inertia::render('marketing/features');
})->name('features');

// About Us page
Route::get('/about', function () {
    return Inertia::render('marketing/about');
})->name('about');

// Contact page
Route::get('/contact', function () {
    return Inertia::render('marketing/contact');
})->name('contact');

// FAQ page
Route::get('/faq', function () {
    return Inertia::render('marketing/faq');
})->name('faq');

// Blog (future)
// Route::get('/blog', function () {
//     return Inertia::render('marketing/blog');
// })->name('blog');
