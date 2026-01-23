import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Section } from '@/types';
import { FormEventHandler, useEffect } from 'react';
import InputError from '@/components/input-error';
import sections from '@/routes/sections';

interface SectionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    menuId: number;
    section?: Section;
}

export function SectionModal({ open, onOpenChange, menuId, section }: SectionModalProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        menu_id: menuId,
        name: section?.name || '',
        description: section?.description || '',
        order: section?.order || 0,
        is_active: section?.is_active ?? true,
    });

    useEffect(() => {
        if (section) {
            setData({
                menu_id: menuId,
                name: section.name,
                description: section.description || '',
                order: section.order,
                is_active: section.is_active,
            });
        } else {
            reset();
            setData('menu_id', menuId);
        }
    }, [section, open]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (section) {
            put(sections.update(section.id).url, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        } else {
            post(sections.store().url, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {section ? 'Editar Seção' : 'Nova Seção'}
                    </DialogTitle>
                    <DialogDescription>
                        {section 
                            ? 'Atualize as informações da seção do cardápio.'
                            : 'Adicione uma nova seção ao seu cardápio.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome da Seção*</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Ex: Entradas, Pratos Principais..."
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Descrição opcional da seção"
                            rows={3}
                        />
                        <InputError message={errors.description} />
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

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="rounded"
                        />
                        <Label htmlFor="is_active" className="cursor-pointer">
                            Seção ativa
                        </Label>
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
                            {processing ? 'Salvando...' : section ? 'Atualizar' : 'Criar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
