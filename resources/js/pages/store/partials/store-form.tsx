import FormImage1 from '@/assets/images/form/form1.png';
import FormImage2 from '@/assets/images/form/form2.png';
import FormImage3 from '@/assets/images/form/form3.png';
import InputError from '@/components/input-error';
import Stepper from '@/components/stepper';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ColorPicker } from '@/components/ui/color-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { schemas } from '@/lib/validations/store-validations';
import { store as storeRoute, update } from '@/routes/stores';
import { OperatingHours, Store } from '@/types';
import { useForm } from '@inertiajs/react';
import {
    Building,
    ChevronLeft,
    ChevronRight,
    FileText,
    Instagram,
    Phone,
    Plus,
    PlusCircle,
    Trash2,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useMaskInput } from 'use-mask-input';
import OperatingHoursForm from './operating-hours-form';
import { PhoneInput } from './phone-input';

type StoreFormData = Omit<
    Store,
    'id' | 'user_id' | 'created_at' | 'updated_at' | 'address'
> & {
    phones: string[];
    colors: string[];
};

type SubmittedOperatingHours = Array<{
    day: string;
    open: string;
    close: string;
}>;

type SubmittedStoreFormData = Omit<StoreFormData, 'operating_hours'> & {
    operating_hours: SubmittedOperatingHours;
};

interface StepProps {
    form: ReturnType<typeof useForm<StoreFormData>>;
    store: Store | null;
}

const steps = [
    { name: 'Informações Básicas', component: Step1 },
    { name: 'Dados de Contato', component: Step2 },
    { name: 'Horário de Funcionamento', component: Step3 },
];

interface StoreFormProps {
    store: Store | null;
}


export default function StoreForm({ store: storeData }: StoreFormProps) {
    const [step, setStep] = useState(0);

    const form = useForm<StoreFormData>(
        {
            name: '',
            phones: [''],
            colors: ['#000000'],
            operating_hours: {},
            whatsapp: '',
            instagram: '',
            document_type: 'cpf',
            document_number: '',
        },
        {
            transform: (data: StoreFormData): SubmittedStoreFormData => {
                const cleanedWhatsapp = data.whatsapp
                    ? data.whatsapp.replace(/\D/g, '')
                    : '';
                const transformedWhatsapp = cleanedWhatsapp
                    ? '+55' + cleanedWhatsapp
                    : '';

                const transformPhone = (value: string) => {
                    const cleaned = value.replace(/\D/g, '');
                    return cleaned ? '+55' + cleaned : '';
                };

                const transformedOperatingHours = Object.entries(
                    data.operating_hours,
                ).reduce((acc, [day, hours]) => {
                    const dayKey = day as keyof OperatingHours;
                    // Only include if isOpen is true and open/close times are provided
                    if (hours?.isOpen && hours.open && hours.close) {
                        acc.push({
                            day: dayKey,
                            open: hours.open,
                            close: hours.close,
                        });
                    }
                    return acc;
                }, [] as SubmittedOperatingHours);

                return {
                    ...data,
                    phones: data.phones.map(transformPhone).filter(Boolean),
                    whatsapp: transformedWhatsapp,
                    operating_hours: transformedOperatingHours,
                } as SubmittedStoreFormData;
            },
        },
    );

    const { data, post, patch, processing, errors, setError, clearErrors } =
        form;

    const handleNext = () => {
        clearErrors();
        const validation = schemas[step].safeParse(data);

        if (!validation.success) {
            validation.error.issues.forEach((error) => {
                setError(error.path[0] as keyof StoreFormData, error.message);
            });
            toast.error('Verifique os campos e tente novamente.');
            return;
        }

        if (step < steps?.length - 1) {
            setStep(step + 1);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (storeData) {
            patch(update(storeData.id).url, {
                onSuccess: () => toast.success('Loja atualizada com sucesso!'),

                onError: () =>
                    toast.error('Ocorreu um erro ao atualizar a loja.'),
            });
        } else {
            post(storeRoute().url, {
                onSuccess: () => toast.success('Loja criada com sucesso!'),

                onError: () => toast.error('Ocorreu um erro ao criar a loja.'),
            });
        }
    };

    const CurrentStepComponent = steps[step].component;

    useEffect(() => {
        if (!storeData) return;

        form.setData({
            name: storeData.name ?? '',
            phones: storeData.phones ?? [''],
            colors: storeData.colors ?? ['#000000'],
            operating_hours: storeData.operating_hours ?? {},
            whatsapp: storeData.whatsapp ?? '',
            instagram: storeData.instagram ?? '',
            document_type: storeData.document_type ?? 'cpf',
            document_number: storeData.document_number ?? '',
        });
    }, [storeData]);

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <CardHeader className="pt-8">
                        <CardTitle className="mb-3 text-3xl">
                            Configurações da Loja
                        </CardTitle>

                        <CardDescription className="mb-8">
                            Configure os detalhes da sua loja passo a passo.
                        </CardDescription>

                        <Stepper
                            step={step}
                            steps={steps.map((s) => s.name)}
                            setStep={() => {
                                setStep(step);
                            }}
                        />
                    </CardHeader>

                    <div className="mt-6 flex flex-1 justify-center md:mt-0 md:justify-end">
                        <div className="h-full max-h-50 max-w-125">
                            {step === 0 && (
                                <img
                                    src={FormImage1}
                                    alt="Step 1"
                                    className="h-50 w-full"
                                />
                            )}

                            {step === 1 && (
                                <img
                                    src={FormImage2}
                                    alt="Step 2"
                                    className="h-50 w-full"
                                />
                            )}

                            {step === 2 && (
                                <img
                                    src={FormImage3}
                                    alt="Step 3"
                                    className="h-50 w-full"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4">
                    <CurrentStepComponent form={form} store={storeData} />
                </div>

                <CardFooter className="flex w-full justify-between gap-2 px-6 py-4">
                    <div>
                        <Button
                            type="button"
                            disabled={processing}
                            className={`${step === 0 ? 'invisible' : ''}`}
                            onClick={() => setStep(step - 1)}
                        >
                            <ChevronLeft className="mr-2 size-4" />
                            Anterior
                        </Button>
                    </div>

                    <div>
                        <Button
                            type="button"
                            disabled={processing}
                            className={`${steps?.length - 1 === step ? 'hidden' : ''}`}
                            onClick={handleNext}
                        >
                            Próximo
                            <ChevronRight className="ml-2 size-4" />
                        </Button>

                        <Button
                            type="submit"
                            disabled={processing}
                            className={`${steps?.length - 1 === step ? '' : 'hidden'}`}
                        >
                            {processing ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </form>
    );
}

function Step1({ form }: StepProps) {
    const { data, setData, errors } = form;

    const handleAddField = (field: 'colors') => {
        setData(field, [...data[field] ?? [], '#000000']);
    };

    const handleRemoveField = (field: 'colors', index: number) => {
        if (data[field]?.length > 1) {
            const newFields = [...data[field] ?? []];

            newFields.splice(index, 1);

            setData(field, newFields);
        }
    };

    const handleFieldChange = (
        field: 'colors',
        index: number,
        value: string,
    ) => {
        const newFields = [...data[field] ?? []];

        newFields[index] = value;

        setData(field, newFields);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Nome da Loja</Label>

                <div className="relative">
                    <Building className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="pl-9"
                        placeholder="Ex: Cantina da Nona"
                    />
                </div>

                <InputError message={errors.name} />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between flex-row min-h-8">
                    <Label>Cores da Loja (até 3)</Label>

                    {data.colors?.length < 3 && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-zinc-500"
                            onClick={() => handleAddField('colors')}
                        >
                            <PlusCircle className="mr-2 size-4" />
                            Adicionar Cor
                        </Button>
                    )}
                </div>

                <div className="flex flex-row gap-4">
                    {data.colors?.map((color, index) => (
                        <div key={index} className="flex items-center gap-2 relative">
                            <ColorPicker
                                color={color}
                                onChange={(newColor) =>
                                    handleFieldChange('colors', index, newColor)
                                }
                                className="flex-1 transition-all bg-white"
                            />

                            {data.colors?.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        handleRemoveField('colors', index)
                                    }
                                    className='absolute top-0 right-0 w-4 h-4 bg-destructive/20 hover:bg-destructive/30 duration-300 transition-all rounded-full flex items-center justify-center translate-x-1/2 -translate-y-1/2'
                                >
                                    <Trash2 className="size-2 text-destructive" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                <InputError message={errors.colors} />
            </div>
        </div>
    );
}

function Step2({ form }: StepProps) {
    const { data, setData, errors } = form;

    const documentRef = useMaskInput(
        data.document_type === 'cpf'
            ? { mask: '999.999.999-99' }
            : { mask: '99.999.999/9999-99' },
    );

    const handleAddField = (field: 'phones') => {
        setData(field, [...data[field], '']);
    };

    const handleRemoveField = (field: 'phones', index: number) => {
        if (data[field]?.length > 1) {
            const newFields = [...data[field]];
            newFields.splice(index, 1);
            setData(field, newFields);
        }
    };

    const handleFieldChange = (
        field: 'phones',
        index: number,
        value: string,
    ) => {
        const newFields = [...data[field]];
        newFields[index] = value;
        setData(field, newFields);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Telefones (até 3)</Label>
                {data.phones?.map((phone, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Phone className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <PhoneInput
                                value={phone}
                                onChange={(e) =>
                                    handleFieldChange(
                                        'phones',
                                        index,
                                        e.target.value,
                                    )
                                }
                                className="pl-9"
                                placeholder="(99) 99999-9999"
                            />
                        </div>

                        {data.phones?.length > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    handleRemoveField('phones', index)
                                }
                            >
                                <Trash2 className="size-4 text-destructive" />
                            </Button>
                        )}
                    </div>
                ))}

                {data.phones?.length < 3 && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-zinc-500"
                        onClick={() => handleAddField('phones')}
                    >
                        <Plus className="mr-2 size-4" />
                        Adicionar Telefone
                    </Button>
                )}

                <InputError message={errors.phones} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <div className="relative">
                    <Phone className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <PhoneInput
                        id="whatsapp"
                        value={data.whatsapp}
                        onChange={(e) => setData('whatsapp', e.target.value)}
                        className="pl-9"
                        placeholder="(99) 99999-9999"
                    />
                </div>

                <InputError message={errors.whatsapp} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <div className="relative">
                    <Instagram className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="instagram"
                        value={data.instagram}
                        onChange={(e) => setData('instagram', e.target.value)}
                        className="pl-9"
                        placeholder="@seuinstagram"
                    />
                </div>

                <InputError message={errors.instagram} />
            </div>

            <div className="space-y-2">
                <Label>Documento</Label>
                <RadioGroup
                    value={data.document_type}
                    onValueChange={(value) =>
                        setData('document_type', value as 'cpf' | 'cnpj')
                    }
                    className="flex items-center gap-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cpf" id="cpf" />
                        <Label htmlFor="cpf">CPF</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cnpj" id="cnpj" />
                        <Label htmlFor="cnpj">CNPJ</Label>
                    </div>
                </RadioGroup>

                <div className="relative">
                    <FileText className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="document_number"
                        ref={documentRef}
                        value={data.document_number}
                        onChange={(e) =>
                            setData('document_number', e.target.value)
                        }
                        className="pl-9"
                        placeholder={
                            data.document_type === 'cpf'
                                ? '000.000.000-00'
                                : '00.000.000/0000-00'
                        }
                    />
                </div>

                <InputError message={errors.document_number} />
            </div>
        </div>
    );
}

function Step3({ form }: StepProps) {
    const { data, setData } = form;

    return (
        <div className="space-y-6">
            <OperatingHoursForm
                operatingHours={data.operating_hours}
                setData={(key, value) => setData(key, value)}
            />
            <InputError message={form.errors.operating_hours} />
        </div>
    );
}
