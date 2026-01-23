import MenuModal from '@/components/menu-modal';
import { columns } from '@/components/menuTable/columns';
import { DataTable } from '@/components/menuTable/data-table';
import AppLayout from '@/layouts/app-layout';
import menus from '@/routes/menus';
import { PageProps, Menu, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Menu',
        href: menus.index().url,
    },
];

interface MenusProps extends PageProps {
    menus: Menu[];
}

export default function Menus({ menus: menuData }: MenusProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Menus" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex justify-end">
                    <MenuModal />
                </div>
                <DataTable columns={columns} data={menuData} />
            </div>
        </AppLayout>
    );
}
