<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'phones' => ['nullable', 'array', 'max:3'],
            'phones.*' => ['nullable', 'string', 'regex:/^\(\d{2}\)\s\d{4,5}-\d{4}$/'],
            'colors' => ['nullable', 'array', 'max:3'],
            'colors.*' => ['nullable', 'string'],
            'operating_hours' => ['nullable', 'array'],
            'whatsapp' => ['nullable', 'string', 'regex:/^\(\d{2}\)\s\d{4,5}-\d{4}$/'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'document_type' => ['nullable', 'in:cpf,cnpj'],
            'document_number' => ['nullable', 'string', 'max:20'],
        ];
    }
}
