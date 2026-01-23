import { Section } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

    const handleDelete = () => {
        if (confirm('Tem certeza que deseja excluir esta seção? Todos os pratos serão excluídos também.')) {
            router.delete(sections.destroy(section.id).url);
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-move mt-1"
                            >
                                <GripVertical className="size-4 text-muted-foreground" />
                            </Button>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-xl">{section.name}</CardTitle>
                                    <Badge variant={section.is_active ? 'default' : 'secondary'} className="text-xs">
                                        {section.is_active ? 'Ativa' : 'Inativa'}
                                    </Badge>
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
                                onClick={handleDelete}
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
        </>
    );
}
