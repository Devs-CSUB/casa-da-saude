<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'value' => $this->value,
            'appointment_id' => $this->appointment_id,
            'procedure' => new ProcedureResource($this->whenLoaded('procedure')),
            'professional' => new UserResource($this->whenLoaded('professional')),
        ];
    }
}
