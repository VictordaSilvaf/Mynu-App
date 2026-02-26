import { Dish } from '@/types';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import dishes from '@/routes/dishes';
import { DishModal } from './dish-modal';

interface DishCardProps {
    dish: Dish;
    canEditSections?: boolean;
}

export function DishCard({ dish, canEditSections = false }: Readonly<DishCardProps>) {
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

    const hasPromo = dish.promotional_price != null && Number(dish.promotional_price) >= 0;
    const displayPrice = hasPromo ? Number(dish.promotional_price) : dish.price;

    return (
        <>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow pt-0 pb-3">
                {dish.image ? (
                    <div className="relative h-48 lg:h-64 overflow-hidden bg-muted">
                        <img
                            src={`/storage/${dish.image}`}
                            alt={dish.name}
                            className="size-full object-cover"
                        />
                        <div className="absolute top-1.5 right-1.5 flex gap-1">
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
                    <div className="relative h-28 bg-muted flex items-center justify-center">
                        <ImageIcon className="size-8 text-muted-foreground" />
                        <div className="absolute top-1.5 right-1.5 flex gap-1">
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

                <CardHeader className="p-3">
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm line-clamp-1">
                            {dish.name}
                        </CardTitle>
                        <span className="text-base font-bold whitespace-nowrap flex flex-col items-end">
                            {hasPromo && (
                                <span className="text-[11px] font-normal text-muted-foreground line-through">
                                    {formatPrice(dish.price)}
                                </span>
                            )}
                            {formatPrice(displayPrice)}
                        </span>
                    </div>
                    {dish.description && (
                        <CardDescription className="text-xs line-clamp-2">
                            {dish.description}
                        </CardDescription>
                    )}
                </CardHeader>

                <CardFooter className="px-3 py-2 pt-0 flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setModalOpen(true)}
                        disabled={!canEditSections}
                    >
                        <Edit className="size-3" />
                        Editar
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                        disabled={!canEditSections}
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
