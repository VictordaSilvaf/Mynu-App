<?php

use App\Http\Controllers\Admin\UserManagementController;
use Illuminate\Support\Facades\Route;

Route::get('/users', [UserManagementController::class, 'index'])->name('admin.users.index');
