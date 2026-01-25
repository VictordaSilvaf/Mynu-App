<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('dishes', function (Blueprint $table) {
            $table->foreignId('store_id')->nullable()->constrained()->cascadeOnDelete()->after('id');
        });

        // To avoid issues with existing data, we'll delete all dishes and then set the column to not be nullable.
        DB::table('dishes')->delete();

        Schema::table('dishes', function (Blueprint $table) {
            $table->foreignId('store_id')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dishes', function (Blueprint $table) {
            $table->dropForeign(['store_id']);
            $table->dropColumn('store_id');
        });
    }
};
