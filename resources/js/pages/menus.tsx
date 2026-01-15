import MenuModal from '@/components/menu-modal';
import { columns } from '@/components/menuTable/columns';
import { DataTable } from '@/components/menuTable/data-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { menus } from '@/routes';
import { Menu, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Menu',
        href: menus().url,
    },
];

export const payments: Menu[] = [
    {
        id: "89b4e710-5ab5-4578-ae71-3b7e750f07e4",
        name: "Cardápio Base",
        isActive: true,
        items: 24,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
    },
    {
        id: "19b4e210-5ab5-4578-ae71-9b7e750f07e1",
        name: "Cardápio Natal",
        isActive: false,
        items: 12,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
    },
]

export default function Menus() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Menus" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex justify-end">
                    <MenuModal />
                </div>
                <DataTable columns={columns} data={payments} />
            </div>
        </AppLayout>
    );
}
