<?php

namespace App\Http\Requests\Subscription;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ChangePlanRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'new_price_id' => ['required', 'string'],
            'subscription_name' => ['nullable', 'string', 'max:255'],
            'prorate' => ['nullable', 'boolean'],
            'invoice_now' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'new_price_id.required' => 'O novo plano é obrigatório.',
            'new_price_id.string' => 'O novo plano deve ser uma string válida.',
        ];
    }
}
