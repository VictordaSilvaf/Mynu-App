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
            'logo_image' => ['nullable', 'image', 'max:2048'],
            'background_image' => ['nullable', 'image', 'max:2048'],
            'phones' => ['nullable', 'array', 'max:3'],
            'phones.*' => ['nullable', 'string', function (string $attribute, mixed $value, \Closure $fail) {
                $digits = preg_replace('/\D/', '', (string) $value);
                $len = strlen($digits);
                if ($len === 10 || $len === 11) {
                    return;
                }
                if (str_starts_with($digits, '55') && strlen($digits) === 12) {
                    return;
                }
                if (str_starts_with($digits, '55') && strlen($digits) === 13) {
                    return;
                }
                $fail(__('O telefone deve ter 10 ou 11 dígitos.'));
            }],
            'colors' => ['required', 'array', 'size:9'],
            'colors.*' => ['required', 'string'],
            'operating_hours' => ['nullable', 'array'],
            'whatsapp' => ['nullable', 'string', function (string $attribute, mixed $value, \Closure $fail) {
                $digits = preg_replace('/\D/', '', (string) $value);
                $len = strlen($digits);
                if ($len === 10 || $len === 11) {
                    return;
                }
                if (str_starts_with($digits, '55') && (strlen($digits) === 12 || strlen($digits) === 13)) {
                    return;
                }
                $fail(__('O WhatsApp deve ter 10 ou 11 dígitos.'));
            }],
            'instagram' => ['nullable', 'string', 'max:255'],
            'document_type' => ['nullable', 'in:cpf,cnpj'],
            'document_number' => ['nullable', 'string', 'max:20'],
        ];
    }
}
