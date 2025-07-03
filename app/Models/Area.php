<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Area extends Model
{
    use HasFactory;
    protected $fillable = [
        'name'
    ];

    /**
     * Relacionamento: Uma Área tem várias Categorias.
     */
    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    /**
     * Relacionamento: Uma Área acessa os Procedimentos através das Categorias.
     */
    public function procedures(): HasManyThrough
    {
        return $this->hasManyThrough(Procedure::class, Category::class, 'area_id', 'category_id');
    }
}
