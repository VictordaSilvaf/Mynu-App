<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        $store = $user->store;

        if (! $store) {
            $store = $user->store()->create([
                'name' => null,
                'logo_image' => null,
                'background_image' => null,
                'phones' => [],
                'colors' => ['#f8fafc', '#e0e7ff', '#c7d2fe', '#1e293b', '#64748b', '#334155', '#ffffff', '#0f172a', '#059669'],
                'operating_hours' => [],
                'whatsapp' => null,
                'instagram' => null,
                'document_type' => null,
                'document_number' => null,
            ]);
        }

        return Inertia::render('store/index', [
            'store' => $store,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $request->user()->store()->create($request->validated());

        return redirect()->route('stores.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreRequest $request, string $id)
    {
        $store = $request->user()->store()->findOrFail($id);

        $data = $request->validated();

        if ($request->hasFile('logo_image')) {
            if ($store->logo_image) {
                Storage::disk('public')->delete($store->logo_image);
            }
            $data['logo_image'] = $request->file('logo_image')->store('stores', 'public');
        }

        if ($request->hasFile('background_image')) {
            if ($store->background_image) {
                Storage::disk('public')->delete($store->background_image);
            }
            $data['background_image'] = $request->file('background_image')->store('stores', 'public');
        }

        $store->update($data);

        return redirect()->route('stores.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
