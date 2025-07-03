<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('permissions')->insert([
            ['id' => 1, 'module_id' => 1, 'name' => 'Ver', 'guard' => 'read_dashboard'],

            ['id' => 2, 'module_id' => 2, 'name' => 'Ver', 'guard' => 'read_users'],
            ['id' => 3, 'module_id' => 2, 'name' => 'Criar/Editar', 'guard' => 'write_users'],

            ['id' => 4, 'module_id' => 3, 'name' => 'Ver', 'guard' => 'read_roles'],
            ['id' => 5, 'module_id' => 3, 'name' => 'Criar/Editar', 'guard' => 'write_roles'],

            ['id' => 6, 'module_id' => 4, 'name' => 'Ver', 'guard' => 'read_patients'],
            ['id' => 7, 'module_id' => 4, 'name' => 'Criar/Editar', 'guard' => 'write_patients'],

            ['id' => 8, 'module_id' => 5, 'name' => 'Ver', 'guard' => 'read_procedures'],
            ['id' => 9, 'module_id' => 5, 'name' => 'Criar/Editar', 'guard' => 'write_procedures'],
        ]);

        //Role 2 - Administrador
        DB::table('permission_role')->insert([
            ['permission_id' => 1, 'role_id' => 2, ],
            ['permission_id' => 2, 'role_id' => 2, ],
            ['permission_id' => 3, 'role_id' => 2, ],
            ['permission_id' => 4, 'role_id' => 2, ],
            ['permission_id' => 5, 'role_id' => 2, ],
            ['permission_id' => 6, 'role_id' => 2, ],
            ['permission_id' => 7, 'role_id' => 2, ],
            ['permission_id' => 8, 'role_id' => 2, ],
            ['permission_id' => 9, 'role_id' => 2, ],
        ]);

        //Role 3 - Atendente
        DB::table('permission_role')->insert([
            ['permission_id' => 1, 'role_id' => 3, ], // Ler Dashboard
            ['permission_id' => 2, 'role_id' => 3, ], // read_users
            ['permission_id' => 6, 'role_id' => 2, ],
            ['permission_id' => 7, 'role_id' => 2, ],
            ['permission_id' => 8, 'role_id' => 2, ],
        ]);


        //Role 4 - Atendente
        DB::table('permission_role')->insert([
            ['permission_id' => 1, 'role_id' => 4, ], // Ler Dashboard
            ['permission_id' => 2, 'role_id' => 4, ], // read_users
            ['permission_id' => 8, 'role_id' => 2, ],
        ]);
    }
}
