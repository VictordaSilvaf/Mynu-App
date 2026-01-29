import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Store } from '@/types';
import { Head } from '@inertiajs/react';
import StoreForm from './partials/store-form';
import { index } from '@/routes/stores';
import Heading from '@/components/heading';
import StoreForm2 from './partials/store-form2';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Loja',
        href: index().url,
    },
];

interface StorePageProps {
    store: Store | null;
}

export default function StorePage({ store }: StorePageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Loja" />
            <div className="flex flex-col gap-8 p-4">
                <StoreForm2 store={store} />
                <StoreForm store={store} />
            </div>
        </AppLayout>
    );
}
