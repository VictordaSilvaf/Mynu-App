import { Section } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Edit, Plus, Trash2, GripVertical } from 'lucide-react';
import { DishCard } from '@/components/dishes/dish-card';
import { DishModal } from '@/components/dishes/dish-modal';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import sections from '@/routes/sections';
import { SectionModal } from './section-modal';

interface SectionCardProps {
    section: Section;
    menuId: number;
}

export function SectionCard({ section, menuId }: SectionCardProps) {
    const [dishModalOpen, setDishModalOpen] = useState(false);
    const [sectionModalOpen, setSectionModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleToggle = (checked: boolean) => {
        setIsUpdating(true);
        router.put(
            sections.update(section.id).url,
            { is_active: checked },
            {
                preserveScroll: true,
                onFinish: () => setIsUpdating(false),
            }
        );
    };

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(sections.destroy(section.id).url, {
            onFinish: () => {
                setIsDeleting(false);
                setDeleteDialogOpen(false);
            },
        });
    };

    return (
        <>
            <Card ref={setNodeRef} style={style}>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-move mt-1"
                                {...attributes}
                                {...listeners}
                            >
                                <GripVertical className="size-4 text-muted-foreground" />
                            </Button>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-xl">{section.name}</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={section.is_active}
                                            onCheckedChange={handleToggle}
                                            disabled={isUpdating}
                                            size="sm"
                                        />
                                        <span className="text-xs text-muted-foreground">
                                            {section.is_active ? 'Ativa' : 'Inativa'}
                                        </span>
                                    </div>
                                </div>
                                {section.description && (
                                    <CardDescription className="mt-1">
                                        {section.description}
                                    </CardDescription>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSectionModalOpen(true)}
                            >
                                <Edit className="mr-2 size-4" />
                                Editar
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteDialogOpen(true)}
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {section.dishes && section.dishes.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {section.dishes.map((dish) => (
                                <DishCard key={dish.id} dish={dish} />
                            ))}
                        </div>
                    ) : (
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                            <p className="text-sm text-muted-foreground mb-4">
                                Nenhum prato nesta seção
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDishModalOpen(true)}
                            >
                                <Plus className="mr-2 size-4" />
                                Adicionar prato
                            </Button>
                        </div>
                    )}

                    {section.dishes && section.dishes.length > 0 && (
                        <Button
                            variant="outline"
                            className="w-full mt-4"
                            onClick={() => setDishModalOpen(true)}
                        >
                            <Plus className="mr-2 size-4" />
                            Adicionar prato
                        </Button>
                    )}
                </CardContent>
            </Card>

            <DishModal
                open={dishModalOpen}
                onOpenChange={setDishModalOpen}
                sectionId={section.id}
            />

            <SectionModal
                open={sectionModalOpen}
                onOpenChange={setSectionModalOpen}
                menuId={menuId}
                section={section}
            />

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Excluir Seção</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir a seção "{section.name}"? Todos os pratos desta seção serão excluídos também. Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
