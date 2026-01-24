
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store } from '@/types';
import { store as storeRoute, update } from '@/routes/stores';
import { AtSign, Building, FileText, Instagram, Palette, Phone, PlusCircle, Trash2, Watch, Whatsapp } from 'lucide-react';
import InputError from '@/components/input-error';
import OperatingHoursForm from './operating-hours-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface StoreFormProps {
    store: Store | null;
}

type StoreFormData = Omit<Store, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export default function StoreForm({ store: storeData }: StoreFormProps) {
    const { data, setData, post, patch, processing, errors } = useForm<StoreFormData>({
        name: storeData?.name ?? '',
        phones: storeData?.phones?.length ? storeData.phones : [''],
        colors: storeData?.colors?.length ? storeData.colors : ['#000000'],
        operating_hours: storeData?.operating_hours ?? {},
        whatsapp: storeData?.whatsapp ?? '',
        instagram: storeData?.instagram ?? '',
        document_type: storeData?.document_type ?? null,
        document_number: storeData?.document_number ?? '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (storeData) {
            patch(update({ id: storeData.id }).url);
        } else {
            post(storeRoute().url);
        }
    }

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

    return (
        <Form onSubmit={handleSubmit} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Informações da Loja</CardTitle>
                    <CardDescription>Atualize os detalhes da sua loja.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
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
                        {data.phones.map((phone, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input value={phone} onChange={(e) => handleFieldChange('phones', index, e.target.value)} className="pl-9" placeholder="(99) 99999-9999" />
                                </div>
                                {data.phones.length > 1 && (
                                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveField('phones', index)}>
                                        <Trash2 className="size-4 text-destructive" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        {data.phones.length < 3 && (
                            <Button type="button" variant="outline" size="sm" onClick={() => handleAddField('phones')}>
                                <PlusCircle className="mr-2 size-4" />
                                Adicionar Telefone
                            </Button>
                        )}
                        <InputError message={errors.phones} />
                    </div>

                    <div className="space-y-2">
                        <Label>Cores da Loja (até 3)</Label>
                        {data.colors.map((color, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Palette className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input type="color" value={color} onChange={(e) => handleFieldChange('colors', index, e.target.value)} className="pl-9" />
                                </div>
                                {data.colors.length > 1 && (
                                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveField('colors', index)}>
                                        <Trash2 className="size-4 text-destructive" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        {data.colors.length < 3 && (
                            <Button type="button" variant="outline" size="sm" onClick={() => handleAddField('colors')}>
                                <PlusCircle className="mr-2 size-4" />
                                Adicionar Cor
                            </Button>
                        )}
                        <InputError message={errors.colors} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp</Label>
                        <div className="relative">
                            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input id="whatsapp" value={data.whatsapp} onChange={(e) => setData('whatsapp', e.target.value)} className="pl-9" placeholder="+55 (99) 99999-9999" />
                        </div>
                        <InputError message={errors.whatsapp} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <div className="relative">
                            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input id="instagram" value={data.instagram} onChange={(e) => setData('instagram', e.target.value)} className="pl-9" placeholder="seunegocio" />
                        </div>
                        <InputError message={errors.instagram} />
                    </div>

                    <div className="space-y-2">
                        <Label>Documento</Label>
                        <RadioGroup value={data.document_type ?? ''} onValueChange={(value: 'cpf' | 'cnpj') => setData('document_type', value)} className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value="cpf" id="cpf" />
                                <Label htmlFor="cpf">CPF</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value="cnpj" id="cnpj" />
                                <Label htmlFor="cnpj">CNPJ</Label>
                            </div>
                        </RadioGroup>
                        <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                value={data.document_number}
                                onChange={(e) => setData('document_number', e.target.value)}
                                className="pl-9"
                                placeholder="Seu documento"
                            />
                        </div>
                        <InputError message={errors.document_number} />
                    </div>
                </CardContent>
                <CardHeader>
                    <CardTitle>Horário de Funcionamento</CardTitle>
                </CardHeader>
                <CardContent>
                    <OperatingHoursForm operatingHours={data.operating_hours} setData={(key, value) => setData(key, value)} />
                    <InputError message={errors.operating_hours} />
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                </CardFooter>
            </Card>
        </Form>
    );
}
