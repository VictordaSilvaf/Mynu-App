"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { router } from "@inertiajs/react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Menu } from "@/types"
import { DataTableColumnHeader } from "./data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { index as menusIndex, show as menusShow, destroy as menusDestroy } from "@/routes/menus"

function ActionsCell({ menu }: { menu: Menu }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = () => {
        setIsDeleting(true)
        router.delete(menusDestroy(menu.id).url, {
            onFinish: () => {
                setIsDeleting(false)
                setDeleteDialogOpen(false)
            },
        })
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => router.visit(menusShow(menu.id).url)}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalhes
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setDeleteDialogOpen(true)}
                        className="text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Excluir Cardápio</DialogTitle>
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
                            {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export const columns: ColumnDef<Menu>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nome" />
        ),
        cell: ({ row }) => {
            const menu = row.original
            return (
                <button
                    onClick={() => router.visit(menusShow(menu.id).url)}
                    className="text-left font-medium hover:underline"
                >
                    {menu.name}
                </button>
            )
        },
    },
    {
        accessorKey: "is_active",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const isActive = row.original.is_active

            return (
                <Badge variant={isActive ? "default" : "outline"}>
                    {isActive ? "Ativo" : "Inativo"}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.original.is_active)
        },
    },
    {
        accessorKey: "items",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Pratos" />
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return <ActionsCell menu={row.original} />
        },
    },
]