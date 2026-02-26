<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class PublicMenuController extends Controller
{
    /**
     * Show the public menu page (no auth). Only active menus are shown.
     */
    public function show(Request $request, Menu $menu): \Inertia\Response|Response
    {
        if (! $menu->is_active) {
            abort(404);
        }

        $menu->load([
            'store:id,name,colors,logo_image,background_image',
            'sections' => fn ($query) => $query->with('dishes')->where('is_active', true)->orderBy('order'),
        ]);

        $store = $menu->store;
        if (! $store) {
            abort(404);
        }

        $sections = $menu->sections->map(fn ($section) => [
            'id' => $section->id,
            'name' => $section->name,
            'description' => $section->description,
            'order' => $section->order,
            'dishes' => $section->dishes->filter(fn ($d) => $d->is_active && $d->is_available)->values()->map(fn ($dish) => [
                'id' => $dish->id,
                'name' => $dish->name,
                'description' => $dish->description,
                'price' => (float) $dish->price,
                'promotional_price' => $dish->promotional_price !== null ? (float) $dish->promotional_price : null,
                'image' => $dish->image,
                'order' => $dish->order,
            ])->values()->all(),
        ])->values()->all();

        $colors = $store->colors ?? [];
        $defaults = ['#f8fafc', '#e0e7ff', '#c7d2fe', '#1e293b', '#64748b', '#334155', '#ffffff', '#0f172a', '#059669'];
        $padded = array_slice(array_pad($colors, 9, ''), 0, 9);
        $colors = array_map(fn (string $c, int $i): string => $c !== '' ? $c : $defaults[$i], $padded, array_keys($defaults));

        return Inertia::render('public-menu', [
            'menu' => [
                'id' => $menu->id,
                'name' => $menu->name,
            ],
            'store' => [
                'name' => $store->name,
                'colors' => $colors,
                'logo_image' => $store->logo_image,
                'background_image' => $store->background_image,
            ],
            'sections' => $sections,
        ]);
    }
}
