import { columns } from '@/components/menuTable/columns';
import { DataTable } from '@/components/menuTable/data-table';
import { MenuCard } from '@/components/menu-card';
import AppLayout from '@/layouts/app-layout';
import { index as menusIndex } from '@/routes/menus';
import { reorder as menusReorder } from '@/routes/menus';
import { PageProps, Menu, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { store } from '@/routes/stores';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { LayoutGrid, Table as TableIcon } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from "@dnd-kit/sortable"
import MenuModal from '@/components/menu-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Menu',
        href: menusIndex().url,
    },
];

interface MenusProps extends PageProps {
    menus: Menu[];
    hasStore: boolean;
}

export default function Menus({ menus: menuData, hasStore }: MenusProps) {
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
    const [items, setItems] = useState<Menu[]>(menuData)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (!over || active.id === over.id) {
            return
        }

        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const newItems = arrayMove(items, oldIndex, newIndex)
        setItems(newItems)

        // Update order in backend
        const menusWithOrder = newItems.map((item, index) => ({
            id: item.id,
            order: index,
        }))

        router.post(menusReorder().url, {
            menus: menusWithOrder,
        }, {
            preserveScroll: true,
        })
    }

    if (!hasStore) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Menus" />
                <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 rounded-xl p-4">
                    <p>Você precisa criar uma loja antes de poder criar cardápios.</p>
                    <Link href={store().url}>
                        <Button>Criar Loja</Button>
                    </Link>
                </div>
            </AppLayout>
        );
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Menus" />
            <div className="flex flex-col gap-8 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'table' ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => setViewMode('table')}
                        >
                            <TableIcon className="h-4 w-4" />
                        </Button>
                    </div>
                    <MenuModal />
                </div>

                {viewMode === 'table' ? (
                    <Card>
                        <CardContent>
                            <DataTable columns={columns} data={items} />
                        </CardContent>
                    </Card>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={items.map((item) => item.id)}
                            strategy={rectSortingStrategy}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {items.length > 0 ? (
                                    items.map((menu) => (
                                        <MenuCard key={menu.id} menu={menu} />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-12 text-muted-foreground">
                                        Nenhum cardápio encontrado.
                                    </div>
                                )}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </AppLayout>
    );
}
