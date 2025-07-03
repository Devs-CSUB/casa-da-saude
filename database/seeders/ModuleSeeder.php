<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('modules')->insert([
            ['id' => 1, 'name' => 'Dashboard', 'route' => 'dashboard'],
            ['id' => 2, 'name' => 'Usuários', 'route' => 'users'],
            ['id' => 3, 'name' => 'Tipos de Usuários', 'route' => 'roles'],
            ['id' => 4, 'name' => 'Pacientes', 'route' => 'patients'],
            ['id' => 5, 'name' => 'Procedimentos', 'route' => 'procedures'],
        ]);
    }
}
