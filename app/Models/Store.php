<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'logo_image',
        'background_image',
        'phones',
        'colors',
        'operating_hours',
        'whatsapp',
        'instagram',
        'document_type',
        'document_number',
    ];

    protected $casts = [
        'phones' => 'array',
        'colors' => 'array',
        'operating_hours' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function menus(): HasMany
    {
        return $this->hasMany(Menu::class);
    }

    public function dishes(): HasMany
    {
        return $this->hasMany(Dish::class);
    }

    public function visits(): HasMany
    {
        return $this->hasMany(Visit::class);
    }

    /**
     * Whether the store has the minimum required data to create menus.
     */
    public function isComplete(): bool
    {
        $hasName = ! empty(trim((string) $this->name));
        $phones = $this->phones ?? [];
        $hasPhone = collect($phones)->contains(fn ($p) => ! empty(trim((string) $p)));
        $colors = $this->colors ?? [];
        $hasColor = count($colors) >= 1;

        return $hasName && $hasPhone && $hasColor;
    }
}
