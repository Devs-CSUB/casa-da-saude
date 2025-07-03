<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProcedureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id'  => ['required', 'exists:categories,id'],
            'name'         => ['required', 'string', 'max:255'],
            'description'  => ['required', 'string'],
            'duration'     => ['required', 'integer', 'min:1'],
            'price'        => ['required', 'numeric', 'min:0'],
            'is_active'    => ['required', 'boolean'],
        ];
    }
}
