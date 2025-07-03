<?php

namespace App\Models;

use App\Enums\AppointmentTime;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScheduleItem extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'schedule_id',
        'appointment_item_id',
        'appointment_time',
    ];


    protected function casts(): array
    {
        return [
            'appointment_time' => AppointmentTime::class,
        ];
    }

    /**
     * Relationship with the schedule.
     */
    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }

    /**
     * Relationship with AppointmentItem.
     */
    public function appointmentItem(): BelongsTo
    {
        return $this->belongsTo(AppointmentItem::class);
    }

}
