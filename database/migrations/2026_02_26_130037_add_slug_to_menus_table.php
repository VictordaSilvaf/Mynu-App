<?php

use App\Models\Menu;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('menus', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('name');
        });

        foreach (Menu::all() as $menu) {
            $base = Str::slug($menu->name);
            $slug = $base;
            $count = 0;
            while (Menu::where('slug', $slug)->where('id', '!=', $menu->id)->exists()) {
                $count++;
                $slug = $base.'-'.$count;
            }
            $menu->update(['slug' => $slug]);
        }

        Schema::table('menus', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('menus', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
