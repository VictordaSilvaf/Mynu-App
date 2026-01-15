<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
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

        /*
        |--------------------------------------------------------------------------
        | Usuários de teste
        |--------------------------------------------------------------------------
        */
        $users = [
            [
                'email' => 'free@mynu.com',
                'name' => 'Free User',
                'role' => 'free',
            ],
            [
                'email' => 'pro@mynu.com',
                'name' => 'Pro User',
                'role' => 'pro',
            ],
            [
                'email' => 'enterprise@mynu.com',
                'name' => 'Enterprise User',
                'role' => 'enterprise',
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
    }
}
