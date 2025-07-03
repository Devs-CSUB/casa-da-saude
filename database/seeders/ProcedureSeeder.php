<?php

namespace Database\Seeders;

use App\Models\Procedure;
use Illuminate\Database\Seeder;

class ProcedureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Procedure::create([
            'name' => 'Limpeza Profunda',
            'description' => 'Remoção de impurezas profundas da pele.',
            'duration' => 60,
            'price' => 150.00,
            'is_active' => true,
            'category_id' => 1,
        ]);

        Procedure::create([
            'name' => 'Esfoliação Completa',
            'description' => 'Esfoliação corporal para renovação da pele.',
            'duration' => 30,
            'price' => 120.00,
            'is_active' => true,
            'category_id' => 2,
        ]);

        Procedure::create([
            'name' => 'Higiene Bucal',
            'description' => 'Limpeza dental básica com aplicação de flúor.',
            'duration' => 30,
            'price' => 100.00,
            'is_active' => true,
            'category_id' => 3,
        ]);
    }
}
