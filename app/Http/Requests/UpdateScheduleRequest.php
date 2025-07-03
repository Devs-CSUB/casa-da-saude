<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateScheduleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'professional_id' => ['required', 'exists:users,id'],
            'date'            => ['required', 'date', 'after_or_equal:today'],
            'is_active'       => ['nullable', 'boolean'],
        ];
    }

    /**
     * Custom error messages for validation.
     */
    public function messages(): array
    {
        return [
            'professional_id.required' => 'O profissional é obrigatório.',
            'professional_id.exists'   => 'O profissional selecionado não é válido.',
            'date.required'            => 'A data do agendamento é obrigatória.',
            'date.date'                => 'Insira uma data válida.',
            'date.after_or_equal'      => 'A data deve ser igual ou posterior ao dia de hoje.',
            'is_active.boolean'        => 'O campo de status deve ser verdadeiro ou falso.',
        ];
    }
}
