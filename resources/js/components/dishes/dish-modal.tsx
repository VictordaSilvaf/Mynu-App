import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dish } from '@/types';
import { FormEventHandler, useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import { ImageIcon, Upload, X } from 'lucide-react';
import dishes from '@/routes/dishes';

interface DishModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sectionId: number;
    dish?: Dish;
}

export function DishModal({ open, onOpenChange, sectionId, dish }: Readonly<DishModalProps>) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        section_id: sectionId,
        name: dish?.name || '',
        description: dish?.description || '',
        price: dish?.price || 0,
        promotional_price: dish?.promotional_price ?? '',
        image: null as File | null,
        order: dish?.order || 0,
        is_active: dish?.is_active ?? true,
        is_available: dish?.is_available ?? true,
    });

    useEffect(() => {
        if (dish) {
            setData({
                section_id: sectionId,
                name: dish.name,
                description: dish.description || '',
                price: dish.price,
                promotional_price: dish.promotional_price ?? '',
                image: null,
                order: dish.order,
                is_active: dish.is_active,
                is_available: dish.is_available,
            });
            if (dish.image) {
                setPreviewImage(`/storage/${dish.image}`);
            }
        } else {
            reset();
            setData('section_id', sectionId);
            setPreviewImage(null);
        }
    }, [dish, open]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setPreviewImage(null);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        const url = dish ? dishes.update(dish.id).url : dishes.store().url;
        const submit = dish ? put : post;
        
        submit(url, {
            onSuccess: () => {
                onOpenChange(false);
                reset();
                setPreviewImage(null);
            },
            forceFormData: true,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {dish ? 'Editar Prato' : 'Novo Prato'}
                    </DialogTitle>
                    <DialogDescription>
                        {dish 
                            ? 'Atualize as informações do prato.'
                            : 'Adicione um novo prato ao seu cardápio.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label>Imagem do Prato</Label>
                        {previewImage ? (
                            <div className="relative aspect-video overflow-hidden rounded-lg border">
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="size-full object-cover"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                    onClick={removeImage}
                                >
                                    <X className="size-4" />
                                </Button>
                            </div>
                        ) : (
                            <label className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed hover:border-primary transition-colors">
                                <Upload className="size-8 text-muted-foreground mb-2" />
                                <span className="text-sm text-muted-foreground">
                                    Clique para fazer upload
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        )}
                        <InputError message={errors.image} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="name">Nome do Prato*</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Ex: Risoto de Funghi"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Preço (R$)*</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.price}
                                onChange={(e) => setData('price', parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                            />
                            <InputError message={errors.price} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="promotional_price">Preço promocional (R$)</Label>
                            <Input
                                id="promotional_price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.promotional_price === '' ? '' : data.promotional_price}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setData('promotional_price', v === '' ? '' : parseFloat(v) || 0);
                                }}
                                placeholder="Opcional"
                            />
                            <InputError message={errors.promotional_price} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="order">Ordem</Label>
                            <Input
                                id="order"
                                type="number"
                                value={data.order}
                                onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                min="0"
                            />
                            <InputError message={errors.order} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Descrição do prato"
                            rows={3}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded"
                            />
                            <Label htmlFor="is_active" className="cursor-pointer">
                                Prato ativo
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_available"
                                checked={data.is_available}
                                onChange={(e) => setData('is_available', e.target.checked)}
                                className="rounded"
                            />
                            <Label htmlFor="is_available" className="cursor-pointer">
                                Disponível
                            </Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Salvando...' : dish ? 'Atualizar' : 'Criar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
