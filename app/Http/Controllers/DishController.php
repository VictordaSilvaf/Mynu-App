<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDishRequest;
use App\Http\Requests\UpdateDishRequest;
use App\Models\Dish;
use App\Models\Section;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class DishController extends Controller
{
    use AuthorizesRequests;
    public function store(StoreDishRequest $request): RedirectResponse
    {
        $section = Section::findOrFail($request->section_id);

        $this->authorize('update', $section->menu);

        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('dishes', 'public');
        }

        $section->dishes()->create($data);

        return redirect()->back();
    }

    public function update(UpdateDishRequest $request, Dish $dish): RedirectResponse
    {
        $this->authorize('update', $dish->section->menu);

        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($dish->image) {
                Storage::disk('public')->delete($dish->image);
            }

            $data['image'] = $request->file('image')->store('dishes', 'public');
        }

        $dish->update($data);

        return redirect()->back();
    }

    public function destroy(Dish $dish): RedirectResponse
    {
        $this->authorize('update', $dish->section->menu);

        if ($dish->image) {
            Storage::disk('public')->delete($dish->image);
        }

        $dish->delete();

        return redirect()->back();
    }
}
