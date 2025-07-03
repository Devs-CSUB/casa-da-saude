<?php

namespace App\Models;

use App\Enums\AppointmentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'date',
        'total',
        'status',
    ];

    protected $casts = [
        'status' => AppointmentStatus::class,
        'total' => 'decimal:2',
    ];

    /**
     * Relationship with Patient.
     */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    /**
     * Relationship with AppointmentItem.
     */
    public function items(): HasMany
    {
        return $this->hasMany(AppointmentItem::class);
    }
}
