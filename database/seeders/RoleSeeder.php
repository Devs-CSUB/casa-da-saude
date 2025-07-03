<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('roles')->insert([
            ['id' => 1, 'name' => 'Suporte', 'is_support' => true],
            ['id' => 2, 'name' => 'Administrador', 'is_support' => false],
            ['id' => 3, 'name' => 'Atendente', 'is_support' => false],
            ['id' => 4, 'name' => 'Profissional', 'is_support' => false],
        ]);

        DB::table('role_user')->insert([
            'role_id' => 1,
            'user_id' => 1,
        ]);

        DB::table('role_user')->insert([
            'role_id' => 2,
            'user_id' => 2,
        ]);

        DB::table('role_user')->insert([
            'role_id' => 3,
            'user_id' => 3,
        ]);

        DB::table('role_user')->insert([
            'role_id' => 4,
            'user_id' => 4,
        ]);

        DB::table('role_user')->insert([
            'role_id' => 4,
            'user_id' => 5,
        ]);
    }
}
