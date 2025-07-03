<?php

namespace Database\Seeders;

use App\Models\{User};
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name'     => 'Suporte',
            'email'    => 'suporte@unibalsas.edu.br',
            'password' => Hash::make('12345678'),
        ]);
        User::factory()->create([
            'name'     => 'Administrador',
            'email'    => 'admin@unibalsas.edu.br',
            'password' => Hash::make('12345678'),
        ]);
        User::factory()->create([
            'name'     => 'Usuário',
            'email'    => 'atendente@unibalsas.edu.br',
            'password' => Hash::make('12345678'),
        ]);

        User::factory()->create([
            'name'     => 'Profissional 1',
            'email'    => 'profissional1@unibalsas.edu.br',
            'password' => Hash::make('12345678'),
        ]);

        User::factory()->create([
            'name'     => 'Profissional 2',
            'email'    => 'profissional2@unibalsas.edu.br',
            'password' => Hash::make('12345678'),
        ]);

        $this->call([
            RoleSeeder::class,
            ModuleSeeder::class,
            PermissionSeeder::class,
            AreaSeeder::class,
            CategorySeeder::class,
            ProcedureSeeder::class,
        ]);
    }
}
