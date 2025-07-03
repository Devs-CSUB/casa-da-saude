<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScheduleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'date'           => Carbon::parse($this->date)->format('d/m/Y'),
            'is_active'      => $this->is_active,
            'professional' => [
                'id'    => $this->professional->id,
                'name'  => $this->professional->name,
                'email' => $this->professional->email,
            ],
            'created_at' => $this->created_at ? $this->created_at->format('d/m/Y H:i:s') : null,
            'updated_at' => $this->updated_at ? $this->updated_at->format('d/m/Y H:i:s') : null,
        ];
    }
}
