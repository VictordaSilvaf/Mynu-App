<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Limpa cache do Spatie (obrigatório em seed)
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        /*
        |--------------------------------------------------------------------------
        | Permissions (features)
        |--------------------------------------------------------------------------
        */
        $permissions = [
            'upload_prato_3d',
            'analytics_basico',
            'analytics_avancado',
            'gerenciar_menu',
            'user.management',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission, 'guard_name' => 'web']
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Roles (planos)
        |--------------------------------------------------------------------------
        */
        $free = Role::firstOrCreate(
            ['name' => 'free', 'guard_name' => 'web']
        );

        $pro = Role::firstOrCreate(
            ['name' => 'pro', 'guard_name' => 'web']
        );

        $enterprise = Role::firstOrCreate(
            ['name' => 'enterprise', 'guard_name' => 'web']
        );

        $admin = Role::firstOrCreate(
            ['name' => 'admin', 'guard_name' => 'web']
        );

        Role::firstOrCreate(
            ['name' => 'user', 'guard_name' => 'web']
        );

        /*
        |--------------------------------------------------------------------------
        | Atribuição de permissions por plano
        |--------------------------------------------------------------------------
        */
        $free->syncPermissions([
            'analytics_basico',
        ]);

        $pro->syncPermissions([
            'upload_prato_3d',
            'analytics_basico',
            'gerenciar_menu',
        ]);

        $enterprise->syncPermissions(Permission::all());
        $admin->syncPermissions(Permission::all());

        /*
        |--------------------------------------------------------------------------
        | Usuários de teste
        |--------------------------------------------------------------------------
        */
        $users = [
            [
                'email' => 'free@mynu.com.br',
                'name' => 'Free User',
                'role' => 'free',
            ],
            [
                'email' => 'pro@mynu.com.br',
                'name' => 'Pro User',
                'role' => 'pro',
            ],
            [
                'email' => 'enterprise@mynu.com.br',
                'name' => 'Enterprise User',
                'role' => 'enterprise',
            ],
            [
                'email' => 'admin@mynu.com.br',
                'name' => 'Admin User',
                'role' => 'admin',
            ],
        ];

        foreach ($users as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );

            // garante apenas um plano ativo
            $user->syncRoles([$data['role']]);
        }

        /*
        |--------------------------------------------------------------------------
        | Menus de teste (apenas para pro e enterprise)
        |--------------------------------------------------------------------------
        */
        $proUser = User::where('email', 'pro@mynu.com.br')->first();
        if ($proUser) {
            $menu = $proUser->menus()->create([
                'name' => 'Cardápio Italiano',
                'is_active' => true,
            ]);

            // Seção: Entradas
            $entradasSection = $menu->sections()->create([
                'name' => 'Entradas',
                'description' => 'Deliciosas opções para começar sua refeição',
                'order' => 1,
                'is_active' => true,
            ]);

            $entradasSection->dishes()->create([
                'name' => 'Bruschetta Italiana',
                'description' => 'Pão italiano tostado com tomate fresco, manjericão e azeite extra virgem',
                'price' => 28.90,
                'order' => 1,
                'is_active' => true,
                'is_available' => true,
            ]);

            $entradasSection->dishes()->create([
                'name' => 'Carpaccio de Salmão',
                'description' => 'Salmão fresco em fatias finas com alcaparras e molho de mostarda',
                'price' => 42.90,
                'order' => 2,
                'is_active' => true,
                'is_available' => true,
            ]);

            // Seção: Massas
            $massasSection = $menu->sections()->create([
                'name' => 'Massas',
                'description' => 'Massas artesanais com molhos tradicionais',
                'order' => 2,
                'is_active' => true,
            ]);

            $massasSection->dishes()->create([
                'name' => 'Spaghetti Carbonara',
                'description' => 'Massa fresca com bacon, ovos, queijo pecorino e pimenta do reino',
                'price' => 58.90,
                'order' => 1,
                'is_active' => true,
                'is_available' => true,
            ]);

            $massasSection->dishes()->create([
                'name' => 'Ravioli de Funghi',
                'description' => 'Ravioli recheado com cogumelos ao molho de manteiga e sálvia',
                'price' => 62.90,
                'order' => 2,
                'is_active' => true,
                'is_available' => true,
            ]);

            // Seção: Sobremesas
            $sobremesasSection = $menu->sections()->create([
                'name' => 'Sobremesas',
                'description' => 'Doces tradicionais italianos',
                'order' => 3,
                'is_active' => true,
            ]);

            $sobremesasSection->dishes()->create([
                'name' => 'Tiramisù',
                'description' => 'Clássica sobremesa italiana com café e mascarpone',
                'price' => 32.90,
                'order' => 1,
                'is_active' => true,
                'is_available' => true,
            ]);

            $sobremesasSection->dishes()->create([
                'name' => 'Panna Cotta',
                'description' => 'Creme italiano com calda de frutas vermelhas',
                'price' => 28.90,
                'order' => 2,
                'is_active' => true,
                'is_available' => true,
            ]);
        }
    }
}
