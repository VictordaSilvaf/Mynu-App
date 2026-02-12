<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSectionRequest;
use App\Http\Requests\UpdateSectionRequest;
use App\Models\Menu;
use App\Models\Section;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;

class SectionController extends Controller
{
    use AuthorizesRequests;

    public function store(StoreSectionRequest $request): RedirectResponse
    {
        $menu = Menu::findOrFail($request->menu_id);

        $this->authorize('update', $menu);

        $section = $menu->sections()->create($request->validated());

        return redirect()->back();
    }

    public function update(UpdateSectionRequest $request, Section $section): RedirectResponse
    {
        $this->authorize('update', $section->menu);

        $section->update($request->validated());

        return redirect()->back();
    }

    public function destroy(Section $section): RedirectResponse
    {
        $this->authorize('update', $section->menu);

        $section->delete();

        return redirect()->back();
    }

    public function reorder(\Illuminate\Http\Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'sections' => 'required|array',
            'sections.*.id' => 'required|exists:sections,id',
            'sections.*.order' => 'required|integer',
        ]);

        foreach ($validated['sections'] as $sectionData) {
            $section = Section::find($sectionData['id']);
            $this->authorize('update', $section->menu);
            $section->update(['order' => $sectionData['order']]);
        }

        return redirect()->back();
    }
}
