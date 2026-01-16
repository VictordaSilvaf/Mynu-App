<?php

namespace App\Http\Requests\Subscription;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CreateSubscriptionRequest extends FormRequest
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
            'price_id' => ['required', 'string'],
            'payment_method_id' => ['required', 'string'],
            'name' => ['nullable', 'string', 'max:255'],
            'quantity' => ['nullable', 'integer', 'min:1'],
            'metadata' => ['nullable', 'array'],
            'skip_trial' => ['nullable', 'boolean'],
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
            'price_id.required' => 'O plano é obrigatório.',
            'price_id.string' => 'O plano deve ser uma string válida.',
            'payment_method_id.required' => 'O método de pagamento é obrigatório.',
            'payment_method_id.string' => 'O método de pagamento deve ser uma string válida.',
            'quantity.integer' => 'A quantidade deve ser um número inteiro.',
            'quantity.min' => 'A quantidade deve ser pelo menos 1.',
        ];
    }
}
