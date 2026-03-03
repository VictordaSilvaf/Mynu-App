<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRequest;
use App\Models\Store;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
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

    private function handleImage(
        Store $store,
        StoreRequest $request,
        array &$data,
        string $field
    ): void {
        if (! $request->hasFile($field)) {
            unset($data[$field]);
            return;
        }

        if ($store->{$field}) {
            Storage::disk('public')->delete($store->{$field});
        }

        $data[$field] = $request->file($field)->store('stores', 'public');
    }

    public function update(StoreRequest $request, string $id)
    {
        try {
            $store = $request->user()
                ->store()
                ->findOrFail($id);

            $data = collect($request->validated())
                ->except(['_method'])
                ->all();

            // 🔥 Garante que não sobrescreva com null
            if (! $request->hasFile('logo_image')) {
                unset($data['logo_image']);
            }

            if (! $request->hasFile('background_image')) {
                unset($data['background_image']);
            }

            $this->handleImage($store, $request, $data, 'logo_image');
            $this->handleImage($store, $request, $data, 'background_image');

            $store->update($data);

            return redirect()->route('stores.index');
        } catch (\Throwable $e) {
            Log::error('StoreController@update failed', [
                'store_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw $e;
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
