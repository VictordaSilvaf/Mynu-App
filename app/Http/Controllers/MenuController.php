<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $menus = $request->user()->menus()->latest()->get();

        return Inertia::render('menus', [
            'menus' => $menus,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $request->user()->menus()->create($validated);

        return redirect()->route('menus.index');
    }

    public function show(Menu $menu)
    {
        $this->authorize('view', $menu);

        $menu->load([
            'sections' => fn ($query) => $query->with('dishes')->orderBy('order'),
        ]);

        return Inertia::render('menus/show', [
            'menu' => $menu,
        ]);
    }

    public function update(Request $request, Menu $menu): RedirectResponse
    {
        $this->authorize('update', $menu);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'nullable|boolean',
        ]);

        $menu->update($validated);

        return redirect()->back();
    }

    public function destroy(Menu $menu): RedirectResponse
    {
        $this->authorize('delete', $menu);

        $menu->delete();

        return redirect()->route('menus.index');
    }
}
