<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreScheduleRequest extends FormRequest
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
            'startDate'       => ['required', 'date', 'after_or_equal:today'],
            'endDate'         => ['required', 'date', 'after_or_equal:startDate'],
            'selectedTimes'   => ['required', 'array', 'min:1'],
            'selectedTimes.*' => ['integer'],
            'is_active'       => ['nullable', 'boolean'],
        ];
    }

    /**
     * Custom error messages for validation.
     */
    public function messages(): array
    {
        return [
            'professional_id.required'  => 'O profissional é obrigatório.',
            'professional_id.exists'    => 'O profissional selecionado não é válido.',
            'startDate.required'        => 'A data inicial é obrigatória.',
            'startDate.date'            => 'Insira uma data inicial válida.',
            'startDate.after_or_equal'  => 'A data inicial deve ser igual ou posterior a hoje.',
            'endDate.required'          => 'A data final é obrigatória.',
            'endDate.date'              => 'Insira uma data final válida.',
            'endDate.after_or_equal'    => 'A data final deve ser igual ou posterior à inicial.',
            'selectedTimes.required'    => 'Selecione pelo menos um horário para a agenda.',
            'selectedTimes.array'       => 'Os horários selecionados devem estar em um formato válido.',
            'selectedTimes.min'         => 'Selecione pelo menos um horário para a agenda.',
            'selectedTimes.*.integer'   => 'Um ou mais horários selecionados são inválidos.',
            'is_active.boolean'         => 'O campo ativo deve ser verdadeiro ou falso.',
        ];
    }
}
