import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Menu as MenuType, type PageProps, type Section } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, ArrowLeft, Settings, Lock, Eye, EyeOff, Trash2, Pencil } from 'lucide-react';
import { SectionCard } from '@/components/sections/section-card';
import { SectionModal } from '@/components/sections/section-modal';
import { useState, useEffect } from 'react';
import menus, { destroy as menusDestroy, update as menusUpdate, index as menusIndex } from '@/routes/menus';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { reorder as sectionsReorder } from '@/routes/sections';

interface ShowMenuProps extends PageProps {
    menu: MenuType;
    canEditSections?: boolean;
}

export default function ShowMenu({ menu, canEditSections = false }: Readonly<ShowMenuProps>) {
    const [sectionModalOpen, setSectionModalOpen] = useState(false);
    const [sections, setSections] = useState<Section[]>(menu.sections || []);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [menuName, setMenuName] = useState(menu.name);
    const [isActive, setIsActive] = useState(!!menu.is_active);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSections(menu.sections || []);
        setMenuName(menu.name);
        setIsActive(!!menu.is_active);
    }, [menu.sections, menu.name, menu.is_active]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = sections.findIndex((item) => item.id === active.id);
        const newIndex = sections.findIndex((item) => item.id === over.id);

        const newSections = arrayMove(sections, oldIndex, newIndex);
        setSections(newSections);

        const sectionsWithOrder = newSections.map((item, index) => ({
            id: item.id,
            order: index,
        }));

        router.post(sectionsReorder().url, {
            sections: sectionsWithOrder,
        }, {
            preserveScroll: true,
        });
    };

    const handleToggleActive = (nextActive: boolean): void => {
        setIsUpdating(true);

        router.put(
            menusUpdate(menu.id).url,
            { name: menuName, is_active: nextActive },
            {
                preserveScroll: true,
                onFinish: () => setIsUpdating(false),
                onSuccess: () => setIsActive(nextActive),
            },
        );
    };

    const handleSaveName = (): void => {
        if (!menuName.trim()) {
            return;
        }

        setIsUpdating(true);

        router.put(
            menusUpdate(menu.id).url,
            { name: menuName.trim(), is_active: isActive },
            {
                preserveScroll: true,
                onFinish: () => setIsUpdating(false),
                onSuccess: () => setEditDialogOpen(false),
            },
        );
    };

    const handleDelete = (): void => {
        setIsDeleting(true);

        router.delete(menusDestroy(menu.id).url, {
            onSuccess: () => router.visit(menusIndex().url),
            onFinish: () => {
                setIsDeleting(false);
                setDeleteDialogOpen(false);
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Menus',
            href: menus.index().url,
        },
        {
            title: menu.name,
            href: menus.show(menu.id).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Menu: ${menu.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {!canEditSections && (
                    <Alert>
                        <Lock className="size-4" />
                        <AlertTitle>Recurso dos planos Pro e Enterprise</AlertTitle>
                        <AlertDescription>
                            Crie sessões e pratos apenas nos planos Pro ou Enterprise. Faça upgrade para desbloquear.
                        </AlertDescription>
                    </Alert>
                )}
                {/* Header */}
                <div className="flex items-center justify-between flex-col md:flex-row">
                    <div className="flex items-center gap-4 w-full">
                        <Link href={menus.index().url}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold">{menu.name}</h1>
                                <Badge variant={menu.is_active ? 'default' : 'secondary'}>
                                    {menu.is_active ? 'Ativo' : 'Inativo'}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Gerencie as seções e pratos do seu cardápio
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 w-full justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className='p-3'>
                                <Button variant="outline" size="icon" className=''>
                                    <Settings className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => setEditDialogOpen(true)}
                                >
                                    <Pencil className="mr-2 size-4" />
                                    Editar nome
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleToggleActive(!isActive)}
                                    disabled={isUpdating}
                                >
                                    {isActive ? (
                                        <>
                                            <EyeOff className="mr-2 size-4" />
                                            Desativar cardápio
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="mr-2 size-4" />
                                            Ativar cardápio
                                        </>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setDeleteDialogOpen(true)}
                                    className="text-destructive"
                                >
                                    <Trash2 className="mr-2 size-4" />
                                    Excluir cardápio
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button onClick={() => setSectionModalOpen(true)} disabled={!canEditSections} className='w-full md:w-auto'>
                            <Plus className="size-4" />
                            Nova Seção
                        </Button>
                    </div>
                </div>

                {/* Sections */}
                {sections && sections.length > 0 ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={sections.map((item) => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="grid gap-6">
                                {sections.map((section) => (
                                    <SectionCard key={section.id} section={section} menuId={menu.id} canEditSections={canEditSections} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold">Nenhuma seção criada</h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Comece criando seções para organizar seu cardápio
                                </p>
                                <Button
                                    className="mt-4"
                                    onClick={() => setSectionModalOpen(true)}
                                    disabled={!canEditSections}
                                >
                                    <Plus className="mr-2 size-4" />
                                    Criar primeira seção
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <SectionModal
                open={sectionModalOpen}
                onOpenChange={setSectionModalOpen}
                menuId={menu.id}
            />

            {/* Editar nome do cardápio */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar cardápio</DialogTitle>
                        <DialogDescription>
                            Atualize o nome do cardápio. Você pode ativar ou desativar o cardápio pelo menu de configurações.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        <label className="flex flex-col gap-1 text-sm">
                            <span className="font-medium">Nome do cardápio</span>
                            <Input
                                value={menuName}
                                onChange={(event) => setMenuName(event.target.value)}
                                placeholder="Digite o nome do cardápio"
                            />
                        </label>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditDialogOpen(false)}
                            disabled={isUpdating}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSaveName}
                            disabled={isUpdating || !menuName.trim()}
                        >
                            {isUpdating ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Excluir cardápio */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Excluir cardápio</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir o cardápio &quot;{menu.name}&quot;? Essa ação não pode ser desfeita.
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
                            {isDeleting ? 'Excluindo...' : 'Excluir'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
