<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/users/index', [
            'users' => User::with('roles')->paginate(),
        ]);
    }
}
