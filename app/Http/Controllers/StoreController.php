<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRequest;
use Illuminate\Support\Facades\Auth;
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
                'phones' => [],
                'colors' => ['#000000'],
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

        $store->update($request->validated());

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
