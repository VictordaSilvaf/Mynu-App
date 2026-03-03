<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $input = $this->all();
        if (array_key_exists('logo_image', $input) && ! $this->hasFile('logo_image')) {
            $input['logo_image'] = null;
            $this->merge($input);
        }
        if (array_key_exists('background_image', $input) && ! $this->hasFile('background_image')) {
            $input['background_image'] = null;
            $this->merge($input);
        }
    }

    protected function failedValidation(Validator $validator): void
    {
        Log::warning('StoreRequest validation failed', [
            'errors' => $validator->errors()->toArray(),
            'input_keys' => array_keys($this->except(['logo_image', 'background_image'])),
            'has_logo_file' => $this->hasFile('logo_image'),
            'has_background_file' => $this->hasFile('background_image'),
        ]);

        throw new ValidationException($validator);
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
            'background_image' => ['nullable', 'image', 'max:12288'],
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
