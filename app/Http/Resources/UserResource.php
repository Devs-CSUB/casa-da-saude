<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'area_id' => $this->resource->area_id,
            'area' => $this->whenLoaded('area'),
            'name' => $this->resource->name,
            'email' => $this->resource->email,
            'image_path' => $this->resource->image_path,
            'created_at' => $this->resource->created_at,
            'updated_at' => $this->resource->updated_at,
            'deleted_at' => $this->resource->deleted_at,
            'restored_at' => $this->resource->restored_at,
            'roles' => RoleResource::collection($this->resource->roles),
        ];
    }
}
