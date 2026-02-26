import imgBrownie from '@/assets/images/comidas/Brownie.jpg';
import imgBruschetta from '@/assets/images/comidas/Bruschetta.jpg';
import imgCarpaccio from '@/assets/images/comidas/Carpaccio.jpg';
import imgFile from '@/assets/images/comidas/Filé ao molho.jpg';
import imgPudim from '@/assets/images/comidas/Pudim de leite.jpg';
import imgRisoto from '@/assets/images/comidas/Risoto de cogumelos.jpg';
import imgSalada from '@/assets/images/comidas/Salada Caesar.jpg';
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
    ImageIcon,
    Instagram,
    Phone,
    Plus,
    PlusCircle,
    Trash2,
    Upload,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useMaskInput } from 'use-mask-input';
import OperatingHoursForm from './operating-hours-form';
import { PhoneInput } from './phone-input';

type StoreFormData = Omit<
    Store,
    'id' | 'user_id' | 'created_at' | 'updated_at' | 'address' | 'logo_image' | 'background_image'
> & {
    phones: string[];
    colors: string[];
    logo_image: File | null;
    background_image: File | null;
};

type SubmittedOperatingHours = Array<{
    day: string;
    open: string;
    close: string;
}>;

type SubmittedStoreFormData = Omit<
    StoreFormData,
    'operating_hours' | 'logo_image' | 'background_image'
> & {
    operating_hours: SubmittedOperatingHours;
    logo_image?: File;
    background_image?: File;
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

interface MenuColorPreviewProps {
    colors: string[];
    storeName: string;
    logoImageUrl: string | null;
    backgroundImageUrl: string | null;
}

const PREVIEW_SECTIONS: Array<{
    name: string;
    description: string | null;
    dishes: Array<{
        name: string;
        description: string | null;
        price: number;
        promotionalPrice: number | null;
        hasImage: boolean;
    }>;
}> = [
    {
        name: 'Entradas',
        description: 'Para começar bem.',
        dishes: [
            { name: 'Bruschetta', description: 'Pão crocante com tomate, manjericão e azeite.', price: 24.9, promotionalPrice: 19.9, hasImage: true },
            { name: 'Carpaccio', description: 'Fatias finas de carne com rúcula e parmesão.', price: 32, promotionalPrice: null, hasImage: false },
        ],
    },
    {
        name: 'Pratos principais',
        description: null,
        dishes: [
            { name: 'Filé ao molho', description: 'Filé mignon, batatas e legumes da época.', price: 58, promotionalPrice: 49.9, hasImage: true },
            { name: 'Risoto de cogumelos', description: 'Arroz arbóreo, cogumelos frescos e parmesão.', price: 42, promotionalPrice: null, hasImage: true },
            { name: 'Salada Caesar', description: 'Alface, frango grelhado, croutons e molho Caesar.', price: 36, promotionalPrice: null, hasImage: false },
        ],
    },
    {
        name: 'Sobremesas',
        description: 'Finalize com doce.',
        dishes: [
            { name: 'Brownie', description: 'Brownie de chocolate com sorvete.', price: 22, promotionalPrice: 18, hasImage: true },
            { name: 'Pudim de leite', description: 'Pudim tradicional com calda de caramelo.', price: 16, promotionalPrice: null, hasImage: false },
        ],
    },
];

const PREVIEW_DISH_IMAGES: Record<string, string> = {
    Bruschetta: imgBruschetta,
    Carpaccio: imgCarpaccio,
    'Filé ao molho': imgFile,
    'Risoto de cogumelos': imgRisoto,
    'Salada Caesar': imgSalada,
    Brownie: imgBrownie,
    'Pudim de leite': imgPudim,
};

function formatPreviewPrice(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function MenuColorPreview({ colors, storeName, logoImageUrl, backgroundImageUrl }: Readonly<MenuColorPreviewProps>) {
    const [cBg, cGrad1, cGrad2, cTitle, cSub, cSection, cCardBg, cCardText, cPrice] = colors.length >= 9
        ? colors
        : ['#f8fafc', '#e0e7ff', '#c7d2fe', '#1e293b', '#64748b', '#334155', '#ffffff', '#0f172a', '#059669'];

    const headerStyle = backgroundImageUrl
        ? {
            backgroundImage: `linear-gradient(0deg, rgba(255,255,255,0.85) 0%, rgba(248,248,248,0.7) 100%), url(${backgroundImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }
        : {
            background: `linear-gradient(135deg, ${cGrad1} 0%, ${cGrad2} 100%)`,
        };

    return (
        <div
            className="flex w-full flex-1 overflow-hidden rounded-xl border border-border shadow-md"
            style={{ backgroundColor: cBg }}
        >
            <div className="flex min-h-0 flex-1 flex-col">
                <div
                    className="relative min-h-[100px] shrink-0 px-3 py-4 text-center sm:min-h-[120px]"
                    style={{ ...headerStyle, borderBottom: `1px solid ${cTitle}25` }}
                >
                    {logoImageUrl && (
                        <div className="mb-2 flex justify-center">
                            <img
                                src={logoImageUrl}
                                alt=""
                                className="h-12 w-12 rounded-xl border-2 border-white/80 object-cover shadow sm:h-14 sm:w-14"
                            />
                        </div>
                    )}
                    <div className="text-sm font-bold truncate drop-shadow-sm" style={{ color: cTitle }}>
                        {storeName || 'Sua loja'}
                    </div>
                    <div className="mt-0.5 text-xs" style={{ color: cSub }}>
                        Cardápio
                    </div>
                </div>
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3">
                    {PREVIEW_SECTIONS.map((section) => (
                        <section key={section.name} className="space-y-2">
                            <h3 className="text-xs font-semibold" style={{ color: cSection }}>
                                {section.name}
                            </h3>
                            {section.description && (
                                <p
                                    className="text-[10px] leading-relaxed opacity-85"
                                    style={{ color: cSection }}
                                >
                                    {section.description}
                                </p>
                            )}
                            <div className="space-y-2">
                                {section.dishes.map((dish) => (
                                    <div
                                        key={dish.name}
                                        className="flex gap-2 rounded-lg border text-left"
                                        style={{
                                            backgroundColor: cCardBg,
                                            borderColor: `${cCardText}30`,
                                        }}
                                    >
                                        {PREVIEW_DISH_IMAGES[dish.name] ? (
                                            <img
                                                src={PREVIEW_DISH_IMAGES[dish.name]}
                                                alt=""
                                                className="size-20 shrink-0 rounded-md object-cover"
                                            />
                                        ) : dish.hasImage ? (
                                            <div
                                                className="size-20 shrink-0 rounded-md bg-muted"
                                                aria-hidden
                                            />
                                        ) : (
                                            <div
                                                className="size-20 shrink-0 rounded-md bg-muted/60"
                                                aria-hidden
                                            />
                                        )}
                                        <div className="min-w-0 flex-1 py-1.5 pr-2">
                                            <div className="text-xs font-medium truncate" style={{ color: cCardText }}>
                                                {dish.name}
                                            </div>
                                            {dish.description && (
                                                <p
                                                    className="mt-0.5 line-clamp-2 text-[10px] leading-snug opacity-85"
                                                    style={{ color: cCardText }}
                                                >
                                                    {dish.description}
                                                </p>
                                            )}
                                            <span
                                                className="mt-1 inline-flex flex-wrap items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold"
                                                style={{ backgroundColor: `${cPrice}20`, color: cPrice }}
                                            >
                                                {dish.promotionalPrice != null && (
                                                    <span className="font-normal opacity-70 line-through">
                                                        {formatPreviewPrice(dish.price)}
                                                    </span>
                                                )}
                                                {formatPreviewPrice(dish.promotionalPrice ?? dish.price)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface StoreFormProps {
    store: Store | null;
}


export default function StoreForm({ store: storeData }: StoreFormProps) {
    const [step, setStep] = useState(0);

    const DEFAULT_COLORS_9 = ['#f8fafc', '#e0e7ff', '#c7d2fe', '#1e293b', '#64748b', '#334155', '#ffffff', '#0f172a', '#059669'];

    const initialData: StoreFormData = {
        name: '',
        logo_image: null,
        background_image: null,
        phones: [''],
        colors: [...DEFAULT_COLORS_9],
        operating_hours: {},
        whatsapp: '',
        instagram: '',
        document_type: 'cpf',
        document_number: '',
    };

    const formOptions = {
        transform: (formData: StoreFormData) => buildSubmitPayload(formData),
    };
    const form = (
        useForm as (
            data: StoreFormData,
            options: { transform: (data: StoreFormData) => SubmittedStoreFormData },
        ) => ReturnType<typeof useForm<StoreFormData>>
    )(initialData, formOptions);

    function buildSubmitPayload(formData: StoreFormData): SubmittedStoreFormData {
        const cleanedWhatsapp = formData.whatsapp
            ? formData.whatsapp.replace(/\D/g, '')
            : '';
        const transformedWhatsapp = cleanedWhatsapp
            ? '+55' + cleanedWhatsapp
            : '';
        const transformPhone = (value: string) => {
            const cleaned = value.replace(/\D/g, '');
            return cleaned ? '+55' + cleaned : '';
        };
        const transformedOperatingHours = Object.entries(
            formData.operating_hours,
        ).reduce((acc, [day, hours]) => {
            const dayKey = day as keyof OperatingHours;
            if (hours?.isOpen && hours.open && hours.close) {
                acc.push({
                    day: dayKey,
                    open: hours.open,
                    close: hours.close,
                });
            }
            return acc;
        }, [] as SubmittedOperatingHours);
        const { logo_image, background_image, ...rest } = formData;
        return {
            ...rest,
            phones: formData.phones.map(transformPhone).filter(Boolean),
            whatsapp: transformedWhatsapp,
            operating_hours: transformedOperatingHours,
            ...(logo_image instanceof File && { logo_image }),
            ...(background_image instanceof File && { background_image }),
        } as SubmittedStoreFormData;
    }

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

        const hasFiles = data.logo_image instanceof File || data.background_image instanceof File;

        if (storeData) {
            patch(update(storeData.id).url, {
                onSuccess: () => toast.success('Loja atualizada com sucesso!'),
                onError: () => toast.error('Ocorreu um erro ao atualizar a loja.'),
                forceFormData: hasFiles,
            });
        } else {
            post(storeRoute().url, {
                onSuccess: () => toast.success('Loja criada com sucesso!'),
                onError: () => toast.error('Ocorreu um erro ao criar a loja.'),
                forceFormData: hasFiles,
            });
        }
    };

    const CurrentStepComponent = steps[step].component;

    useEffect(() => {
        if (!storeData) return;

        const phones =
            storeData.phones && storeData.phones.length > 0
                ? storeData.phones
                : [''];

        form.setData({
            name: storeData.name ?? '',
            logo_image: null,
            background_image: null,
            phones,
            colors: storeData.colors?.length === 9 ? storeData.colors : ['#f8fafc', '#e0e7ff', '#c7d2fe', '#1e293b', '#64748b', '#334155', '#ffffff', '#0f172a', '#059669'],
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

function Step1({ form, store }: StepProps) {
    const { data, setData, errors } = form;

    const logoPreview = data.logo_image instanceof File
        ? URL.createObjectURL(data.logo_image)
        : store?.logo_image
            ? `/storage/${store.logo_image}`
            : null;
    const backgroundPreview = data.background_image instanceof File
        ? URL.createObjectURL(data.background_image)
        : store?.background_image
            ? `/storage/${store.background_image}`
            : null;

    const handleFieldChange = (
        field: 'colors',
        index: number,
        value: string,
    ) => {
        const current = data[field] ?? [];
        const newFields = [...current];
        const defaultColors = ['#f8fafc', '#e0e7ff', '#c7d2fe', '#1e293b', '#64748b', '#334155', '#ffffff', '#0f172a', '#059669'];
        while (newFields.length < 9) {
            newFields.push(defaultColors[newFields.length] ?? '#000000');
        }
        newFields[index] = value;
        setData(field, newFields);
    };

    const defaultColors = ['#f8fafc', '#e0e7ff', '#c7d2fe', '#1e293b', '#64748b', '#334155', '#ffffff', '#0f172a', '#059669'];
    const colorSections = [
        { title: 'Página', items: [{ label: 'Fundo da página', index: 0 }] },
        {
            title: 'Header do cardápio',
            items: [
                { label: 'Gradiente 1', index: 1 },
                { label: 'Gradiente 2', index: 2 },
                { label: 'Título (nome da loja)', index: 3 },
                { label: 'Subtítulo (nome do cardápio)', index: 4 },
            ],
        },
        {
            title: 'Lista de pratos',
            items: [
                { label: 'Título da seção', index: 5 },
                { label: 'Fundo do card', index: 6 },
                { label: 'Texto do card', index: 7 },
                { label: 'Preço', index: 8 },
            ],
        },
    ] as const;

    return (
        <div className="grid gap-6 lg:grid-cols-[1fr,minmax(300px,380px)]">
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

                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Imagem principal (logo)</Label>
                        <p className="text-xs text-muted-foreground">Opcional. Exibida no cabeçalho do cardápio público.</p>
                        {logoPreview ? (
                            <div className="relative aspect-square max-w-40 overflow-hidden rounded-lg border bg-muted">
                                <img src={logoPreview} alt="Logo" className="size-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 flex gap-1 p-2">
                                    <label className="flex-1 cursor-pointer">
                                        <span className="inline-flex items-center justify-center rounded bg-background/90 px-2 py-1 text-xs font-medium text-foreground">
                                            Trocar
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => setData('logo_image', e.target.files?.[0] ?? null)}
                                        />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setData('logo_image', null)}
                                        className="rounded bg-background/90 px-2 py-1 text-xs font-medium text-destructive"
                                    >
                                        Remover
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label className="flex aspect-square max-w-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50 hover:bg-muted/80">
                                <Upload className="mb-2 size-8 text-muted-foreground" />
                                <span className="text-center text-sm text-muted-foreground">Clique para enviar</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setData('logo_image', e.target.files?.[0] ?? null)}
                                />
                            </label>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>Imagem de plano de fundo</Label>
                        <p className="text-xs text-muted-foreground">Opcional. Fundo do cabeçalho do cardápio público.</p>
                        {backgroundPreview ? (
                            <div className="relative aspect-video max-w-full overflow-hidden rounded-lg border bg-muted">
                                <img src={backgroundPreview} alt="Fundo" className="size-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 flex gap-1 p-2">
                                    <label className="flex-1 cursor-pointer">
                                        <span className="inline-flex items-center justify-center rounded bg-background/90 px-2 py-1 text-xs font-medium text-foreground">
                                            Trocar
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => setData('background_image', e.target.files?.[0] ?? null)}
                                        />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setData('background_image', null)}
                                        className="rounded bg-background/90 px-2 py-1 text-xs font-medium text-destructive"
                                    >
                                        Remover
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label className="flex aspect-video max-w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50 hover:bg-muted/80">
                                <ImageIcon className="mb-2 size-8 text-muted-foreground" />
                                <span className="text-center text-sm text-muted-foreground">Clique para enviar</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setData('background_image', e.target.files?.[0] ?? null)}
                                />
                            </label>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <Label>Cores do cardápio público (obrigatório)</Label>
                    <InputError message={errors.colors} />
                    {colorSections.map((section) => (
                        <div key={section.title} className="rounded-lg border border-border bg-muted/30 p-3">
                            <p className="mb-3 text-sm font-medium text-foreground">{section.title}</p>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {section.items.map(({ label, index }) => (
                                    <div key={label} className="flex flex-col gap-1.5">
                                        <span className="text-xs text-muted-foreground">{label}</span>
                                        <ColorPicker
                                            color={data.colors?.[index] ?? defaultColors[index]}
                                            onChange={(newColor) => handleFieldChange('colors', index, newColor)}
                                            className="w-full transition-all bg-white"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:sticky lg:top-4 lg:self-start w-full">
                    <Label className="mb-2 block text-muted-foreground">Preview do cardápio</Label>
                    <MenuColorPreview
                        colors={[
                            data.colors?.[0] ?? defaultColors[0],
                            data.colors?.[1] ?? defaultColors[1],
                            data.colors?.[2] ?? defaultColors[2],
                            data.colors?.[3] ?? defaultColors[3],
                            data.colors?.[4] ?? defaultColors[4],
                            data.colors?.[5] ?? defaultColors[5],
                            data.colors?.[6] ?? defaultColors[6],
                            data.colors?.[7] ?? defaultColors[7],
                            data.colors?.[8] ?? defaultColors[8],
                        ]}
                        storeName={data.name || 'Nome da loja'}
                        logoImageUrl={logoPreview}
                        backgroundImageUrl={backgroundPreview}
                    />
                </div>
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
                    <div key={index} className="flex items-center gap-2 mr-8">
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
                        <Plus className="size-4" />
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
