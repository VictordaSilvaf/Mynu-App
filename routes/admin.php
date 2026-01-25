<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserManagementController;
use Illuminate\Support\Facades\Route;

Route::get('/users', [UserManagementController::class, 'index'])->name('users.index');
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
