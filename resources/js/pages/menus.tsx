import MenuModal from '@/components/menu-modal';
import { columns } from '@/components/menuTable/columns';
import { DataTable } from '@/components/menuTable/data-table';
import AppLayout from '@/layouts/app-layout';
import { index as menusIndex } from '@/routes/menus';
import { PageProps, Menu, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { store } from '@/routes/stores';
import { Card, CardContent } from '@/components/ui/card';

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
                <Card>
                    <CardContent>
                        <DataTable columns={columns} data={menuData} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
