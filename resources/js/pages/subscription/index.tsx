import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@inertiajs/core';
import { Head } from '@inertiajs/react';
import { index as subscriptionIndex } from '@/routes/subscription';
import { BreadcrumbItem } from '@/types';

// 1. Definindo a interface baseada no que o Laravel envia
interface Subscription {
    id: number;
    plan_name: string;
    next_billing_date: string;
}

interface IndexProps extends PageProps {
    subscriptions: Subscription[];
    subscription_status: string;
    has_payment_method: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Assinatura',
        href: subscriptionIndex().url,
    },
];

export default function Index({ subscriptions, subscription_status, has_payment_method }: IndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assinaturas" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div>
                        <h1>Minhas Assinaturas</h1>
                        <p>Status: {subscription_status}</p>

                        {has_payment_method ? (
                            <span>Cartão vinculado ✅</span>
                        ) : (
                            <button>Adicionar Cartão</button>
                        )}

                        <ul>
                            {subscriptions.map(sub => (
                                <li key={sub.id}>{sub.plan_name}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}