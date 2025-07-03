<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'professional_id',
        'date',
        'is_active',
    ];

    /**
     * Relationship with the User model (professional).
     */
    public function professional(): BelongsTo
    {
        return $this->belongsTo(User::class, 'professional_id');
    }

    /**
     * Relationship with schedule items.
     */
    public function items(): HasMany
    {
        return $this->hasMany(ScheduleItem::class);
    }
}
