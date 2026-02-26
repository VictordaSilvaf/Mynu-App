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
        if (! $request->user()->store) {
            return Inertia::render('menus', [
                'menus' => [],
                'hasStore' => false,
            ]);
        }

        $menus = $request->user()->store->menus()->orderBy('order')->get();

        return Inertia::render('menus', [
            'menus' => $menus,
            'hasStore' => true,
            'storeComplete' => $request->user()->store->isComplete(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Menu::class);

        if (! $request->user()->store) {
            return redirect()->route('stores.index');
        }

        $store = $request->user()->store;
        if (! $store->isComplete()) {
            return redirect()->route('menus.index')
                ->with('error', 'Complete os dados da loja antes de criar um cardápio.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $request->user()->store->menus()->create($validated);

        return redirect()->route('menus.index');
    }

    public function show(Request $request, Menu $menu)
    {
        $this->authorize('view', $menu);

        $menu->load([
            'sections' => fn ($query) => $query->with('dishes')->orderBy('order'),
        ]);

        $canEditSections = $request->user()->hasRole('pro') || $request->user()->hasRole('enterprise');

        return Inertia::render('menus/show', [
            'menu' => $menu,
            'canEditSections' => $canEditSections,
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

    public function duplicate(Menu $menu): RedirectResponse
    {
        $this->authorize('update', $menu);

        $store = $menu->store;
        $newMenu = $store->menus()->create([
            'name' => $menu->name.' (cópia)',
            'is_active' => false,
            'order' => $store->menus()->max('order') + 1,
        ]);

        foreach ($menu->sections()->orderBy('order')->get() as $section) {
            $newSection = $newMenu->sections()->create([
                'name' => $section->name,
                'description' => $section->description,
                'order' => $section->order,
                'is_active' => $section->is_active,
            ]);

            foreach ($section->dishes()->orderBy('order')->get() as $dish) {
                $newSection->dishes()->create([
                    'store_id' => $store->id,
                    'name' => $dish->name,
                    'description' => $dish->description,
                    'price' => $dish->price,
                    'promotional_price' => $dish->promotional_price,
                    'image' => $dish->image,
                    'order' => $dish->order,
                    'is_active' => $dish->is_active,
                    'is_available' => $dish->is_available,
                ]);
            }
        }

        return redirect()->route('menus.show', $newMenu);
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'menus' => 'required|array',
            'menus.*.id' => 'required|exists:menus,id',
            'menus.*.order' => 'required|integer',
        ]);

        foreach ($validated['menus'] as $menuData) {
            $menu = Menu::find($menuData['id']);
            $this->authorize('update', $menu);
            $menu->update(['order' => $menuData['order']]);
        }

        return redirect()->back();
    }
}
