
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store } from '@/types';
import { store as storeRoute, update } from '@/routes/stores';
import { AtSign, Building, ChevronLeft, ChevronRight, FileText, Instagram, Palette, Phone, Plus, PlusCircle, Trash2 } from 'lucide-react';
import InputError from '@/components/input-error';
import OperatingHoursForm from './operating-hours-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import React, { useRef, useState } from 'react';
import { useMaskInput } from 'use-mask-input';
import { PhoneInput } from './phone-input';
import { toast } from 'sonner';
import { ColorPicker } from '@/components/ui/color-picker';

import FormImage1 from '@/assets/images/form/form1.png';
import FormImage2 from '@/assets/images/form/form2.png';
import FormImage3 from '@/assets/images/form/form3.png';
import Stepper from '@/components/stepper';

interface StoreFormProps {
    store: Store | null;
}

type StoreFormData = Omit<Store, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export default function StoreForm2({ store: storeData }: StoreFormProps) {
    const formRef = useRef<any>(null);
    const [step, setStep] = useState(0);
    const steps = ['Informações Básicas', 'Dados de Contato', 'Horário de Funcionamento'];

    const { data, setData, post, patch, processing, errors } = useForm<StoreFormData>({
        name: storeData?.name ?? '',
        phones: storeData?.phones?.length ? storeData.phones : [''],
        colors: storeData?.colors?.length ? storeData.colors : ['#000000'],
        operating_hours: storeData?.operating_hours ?? {},
        whatsapp: storeData?.whatsapp ?? '',
        instagram: storeData?.instagram ?? '',
        document_type: storeData?.document_type ?? 'cpf',
        document_number: storeData?.document_number ?? '',
    });

    const whatsappRef = useMaskInput({ mask: '(99) 99999-9999' });
    const documentRef = useMaskInput(
        data.document_type === 'cpf'
            ? { mask: '999.999.999-99' }
            : { mask: '99.999.999/9999-99' },
    );

    const handleAddField = (field: 'phones' | 'colors') => {
        setData(field, [...data[field], field === 'colors' ? '#000000' : '']);
    };

    const handleRemoveField = (field: 'phones' | 'colors', index: number) => {
        if (data[field].length > 1) {
            const newFields = [...data[field]];
            newFields.splice(index, 1);
            setData(field, newFields);
        }
    };

    const handleFieldChange = (field: 'phones' | 'colors', index: number, value: string) => {
        const newFields = [...data[field]];
        newFields[index] = value;
        setData(field, newFields);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (storeData) {
            patch(update(storeData.id).url, {
                onSuccess: () => {
                    toast.success('Loja atualizada com sucesso!');
                },
                onError: () => {
                    toast.error('Ocorreu um erro ao atualizar a loja.');
                }
            });
        } else {
            post(storeRoute().url, {
                onSuccess: () => {
                    toast.success('Loja criada com sucesso!');
                },
                onError: () => {
                    toast.error('Ocorreu um erro ao criar a loja.');
                }
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} ref={formRef}>
            <Card>
                <div className="grid grid-cols-2">
                    <CardHeader className='pt-8'>
                        <CardTitle className='text-3xl mb-3'>Configurações da Loja</CardTitle>
                        <CardDescription className='mb-8'>Configure os detalhes da sua loja passo a passo.</CardDescription>

                        <Stepper step={step} steps={steps} setStep={setStep} />
                    </CardHeader>
                    <div className="">
                        {step === 0 && <img src={FormImage1} alt="Step 1" className="w-full h-auto" />}
                        {step === 1 && <img src={FormImage2} alt="Step 2" className="w-full h-auto" />}
                        {step === 2 && <img src={FormImage3} alt="Step 3" className="w-full h-auto" />}
                    </div>
                </div>
                <div className="px-6">
                    <Card className="">
                        <CardContent className="grid gap-6">
                            <div className="flex flex-row items-center gap-4">
                                <span className='w-6 h-6 text-xs rounded-full bg-zinc-200 flex justify-center items-center'>{step + 1}</span>
                                <h3 className='font-bold'>{steps[step]}</h3>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Nome da Loja</Label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="pl-9" placeholder="Ex: Cantina da Nona" />
                                </div>
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label>Telefones (até 3)</Label>
                                <div className="grid grid-cols-3 gap-4">
                                    {data.phones.map((phone, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                <PhoneInput value={phone} onChange={(e) => handleFieldChange('phones', index, e.target.value)} className="pl-9" placeholder="(99) 99999-9999" />
                                            </div>
                                            {data.phones.length > 1 && (
                                                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveField('phones', index)}>
                                                    <Trash2 className="size-4 text-destructive" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {data.phones.length < 3 && (
                                    <Button type="button" variant="outline" size="sm" className='text-zinc-500' onClick={() => handleAddField('phones')}>
                                        <Plus className="size-4" />
                                        Adicionar Telefone
                                    </Button>
                                )}
                                <InputError message={errors.phones} />
                            </div>

                            <div className="space-y-2">
                                <Label>Cores da Loja (até 3)</Label>
                                <div className="flex flex-row gap-4">
                                    {data.colors.map((color, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <ColorPicker
                                                color={color}
                                                onChange={(newColor) => handleFieldChange('colors', index, newColor)}
                                                className="flex-1"
                                            />
                                            {data.colors.length > 1 && (
                                                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveField('colors', index)}>
                                                    <Trash2 className="size-4 text-destructive" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {data.colors.length < 3 && (
                                    <Button type="button" variant="outline" size="sm" className='text-zinc-500' onClick={() => handleAddField('colors')}>
                                        <PlusCircle className="mr-2 size-4" />
                                        Adicionar Cor
                                    </Button>
                                )}
                                <InputError message={errors.colors} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <CardFooter className='w-full'>
                    <CardFooter className="flex w-full justify-between gap-2 px-6 py-4">
                        <div className="">
                            <Button type="button" disabled={processing} className={`${step === 0 ? 'hidden' : ''}`} onClick={() => {
                                if (step > 0) {
                                    setStep(step - 1);
                                }
                            }}>
                                <ChevronLeft className="size-4" />
                                Anterior
                            </Button>
                        </div>
                        <div className="">
                            <Button type="button" disabled={processing} className={`${steps.length - 1 === step ? 'hidden' : ''}`} onClick={() => {
                                if (step < steps.length - 1) {
                                    setStep(step + 1);
                                }
                            }}>
                                Próximo
                                <ChevronRight className="size-4" />
                            </Button>

                            <Button type="submit" disabled={processing} className={`${steps.length - 1 === step ? '' : 'hidden'}`}>
                                {processing ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </div>
                    </CardFooter>
                </CardFooter>
            </Card>
        </form>
    );
}
