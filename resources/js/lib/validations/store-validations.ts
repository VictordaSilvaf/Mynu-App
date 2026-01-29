import { z } from 'zod';

const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

const step1Schema = z.object({
    name: z
        .string()
        .min(3, { message: 'O nome da loja deve ter no mínimo 3 caracteres.' }),
    colors: z
        .array(z.string())
        .min(1, { message: 'Selecione ao menos uma cor.' }),
});

const step2Schema = z.object({
    phones: z
        .array(z.string().regex(phoneRegex, { message: 'Telefone inválido.' }))
        .min(1, { message: 'Informe ao menos um telefone.' }),
    whatsapp: z.string().regex(phoneRegex, { message: 'WhatsApp inválido.' }),
    instagram: z.string().optional(),
    document_type: z.enum(['cpf', 'cnpj']),
    document_number: z
        .string()
        .refine((value) => cpfRegex.test(value) || cnpjRegex.test(value), {
            message: 'CPF ou CNPJ inválido.',
        }),
});

const step3Schema = z.object({
    operating_hours: z
        .record(
            z.object({
                opens_at: z.string().optional(),
                closes_at: z.string().optional(),
                is_open: z.boolean(),
            }),
        )
        .optional(),
});

export const storeSchema = step1Schema.merge(step2Schema).merge(step3Schema);

export const schemas = [step1Schema, step2Schema, step3Schema];
