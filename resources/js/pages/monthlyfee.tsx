import { PricingPage } from '@/components/pricing/PricingPage';
import AppLayout from '@/layouts/app-layout';
import { monthlyfee } from '@/routes';
import { PlansMap, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Assinatura',
        href: monthlyfee().url,
    },
];

export default function MonthlyFee({ plans }: { plans: PlansMap }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assinaturas" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PricingPage plans={plans} />
                </div>
            </div>
        </AppLayout>
    );
}
