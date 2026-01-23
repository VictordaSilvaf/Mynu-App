import { Dish } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import dishes from '@/routes/dishes';
import { DishModal } from './dish-modal';

interface DishCardProps {
    dish: Dish;
}

export function DishCard({ dish }: DishCardProps) {
    const [modalOpen, setModalOpen] = useState(false);

    const handleDelete = () => {
        if (confirm('Tem certeza que deseja excluir este prato?')) {
            router.delete(dishes.destroy(dish.id).url);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(price);
    };

    return (
        <>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                {dish.image ? (
                    <div className="relative aspect-video overflow-hidden bg-muted">
                        <img
                            src={`/storage/${dish.image}`}
                            alt={dish.name}
                            className="size-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                            {!dish.is_available && (
                                <Badge variant="destructive" className="text-xs">
                                    Indisponível
                                </Badge>
                            )}
                            {!dish.is_active && (
                                <Badge variant="secondary" className="text-xs">
                                    Inativo
                                </Badge>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="relative aspect-video bg-muted flex items-center justify-center">
                        <ImageIcon className="size-12 text-muted-foreground" />
                        <div className="absolute top-2 right-2 flex gap-1">
                            {!dish.is_available && (
                                <Badge variant="destructive" className="text-xs">
                                    Indisponível
                                </Badge>
                            )}
                            {!dish.is_active && (
                                <Badge variant="secondary" className="text-xs">
                                    Inativo
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                <CardHeader className="p-4">
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base line-clamp-1">
                            {dish.name}
                        </CardTitle>
                        <span className="text-lg font-bold whitespace-nowrap">
                            {formatPrice(dish.price)}
                        </span>
                    </div>
                    {dish.description && (
                        <CardDescription className="text-sm line-clamp-2">
                            {dish.description}
                        </CardDescription>
                    )}
                </CardHeader>

                <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setModalOpen(true)}
                    >
                        <Edit className="mr-2 size-3" />
                        Editar
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                    >
                        <Trash2 className="size-3" />
                    </Button>
                </CardFooter>
            </Card>

            <DishModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                sectionId={dish.section_id}
                dish={dish}
            />
        </>
    );
}
