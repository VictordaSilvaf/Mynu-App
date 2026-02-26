import { useState } from "react"
import { Menu } from "@/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Eye, MoreVertical, Pencil, Trash2, GripVertical, Copy, ExternalLink, EyeOff } from "lucide-react"
import { router } from "@inertiajs/react"
import { show as menusShow, destroy as menusDestroy, update as menusUpdate, duplicate as menusDuplicate, index as menusIndex } from "@/routes/menus"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface MenuCardProps {
    menu: Menu
}

export function MenuCard({ menu }: MenuCardProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDuplicating, setIsDuplicating] = useState(false)

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: menu.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const handleToggle = (checked: boolean) => {
        setIsUpdating(true)
        router.put(
            menusUpdate(menu.id).url,
            { is_active: checked },
            {
                preserveScroll: true,
                onFinish: () => setIsUpdating(false),
            }
        )
    }

    const handleDelete = () => {
        setIsDeleting(true)
        router.delete(menusDestroy(menu.id).url, {
            onSuccess: () => router.visit(menusIndex().url),
            onFinish: () => {
                setIsDeleting(false)
                setDeleteDialogOpen(false)
            },
        })
    }

    const handleView = () => {
        router.visit(menusShow(menu.id).url)
    }

    const handleEdit = () => {
        router.visit(menusShow(menu.id).url)
    }

    const handleDuplicate = () => {
        setIsDuplicating(true)
        router.post(menusDuplicate(menu.id).url, {}, {
            onFinish: () => setIsDuplicating(false),
        })
    }

    const handleTogglePublish = (checked: boolean) => {
        setIsUpdating(true)
        router.put(
            menusUpdate(menu.id).url,
            { is_active: checked },
            {
                preserveScroll: true,
                onFinish: () => setIsUpdating(false),
            }
        )
    }

    const handleViewPublic = () => {
        window.open(`/cardapio/${menu.id}`, '_blank', 'noopener,noreferrer')
    }

    const handleCardClick = () => {
        router.visit(menusShow(menu.id).url)
    }

    return (
        <>
            <Card
                ref={setNodeRef}
                style={style}
                className="relative hover:shadow-lg transition-shadow cursor-pointer"
                onClick={handleCardClick}
            >
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 cursor-move mt-1"
                                onClick={(e) => e.stopPropagation()}
                                {...attributes}
                                {...listeners}
                            >
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg leading-none tracking-tight">
                                    {menu.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                    {menu.items ? `${menu.items} ${menu.items === 1 ? 'item' : 'itens'}` : 'Nenhum item'}
                                </p>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleView(); }}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Visualizar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(); }}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicate(); }} disabled={isDuplicating}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    {isDuplicating ? 'Duplicando...' : 'Duplicar'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleTogglePublish(!menu.is_active); }} disabled={isUpdating}>
                                    {menu.is_active ? (
                                        <>
                                            <EyeOff className="mr-2 h-4 w-4" />
                                            Despublicar
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Publicar
                                        </>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewPublic(); }}>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Visualizar página pública
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setDeleteDialogOpen(true); }} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="pb-3">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Switch
                            checked={menu.is_active}
                            onCheckedChange={handleToggle}
                            disabled={isUpdating}
                        />
                        <span className="text-sm text-muted-foreground">
                            {menu.is_active ? "Ativo" : "Inativo"}
                        </span>
                    </div>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground pt-0">
                    Criado em {new Date(menu.created_at).toLocaleDateString('pt-BR')}
                </CardFooter>
            </Card>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>Confirmar exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir o cardápio "{menu.name}"? Esta ação não pode ser desfeita.
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
                            {isDeleting ? "Excluindo..." : "Excluir"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
