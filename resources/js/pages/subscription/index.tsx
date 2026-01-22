import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@inertiajs/core';
import { Head, Link } from '@inertiajs/react';
import { index as subscriptionIndex, manage as subscriptionManage } from '@/routes/subscription';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, ArrowRight, Package, CheckCircle2, XCircle, Clock } from 'lucide-react';

// 1. Definindo a interface baseada no que o Laravel envia
interface Subscription {
    id: number;
    plan_name: string;
    next_billing_date: string;
}

interface SubscriptionStatus {
    subscribed: boolean;
    on_trial: boolean;
    on_grace_period: boolean;
    cancelled: boolean;
    ends_at: string | null;
    stripe_status: string | null;
}

interface IndexProps extends PageProps {
    subscriptions: Subscription[];
    subscription_status: SubscriptionStatus;
    has_payment_method: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Assinatura',
        href: subscriptionIndex().url,
    },
];

export default function Index({ subscriptions, subscription_status, has_payment_method }: IndexProps) {
    const getStatusBadge = () => {
        if (subscription_status.on_trial) {
            return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> Período de Teste</Badge>;
        }
        if (subscription_status.cancelled) {
            return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Cancelado</Badge>;
        }
        if (subscription_status.subscribed) {
            return <Badge variant="default" className="gap-1 bg-green-500"><CheckCircle2 className="h-3 w-3" /> Ativo</Badge>;
        }
        return <Badge variant="secondary">Inativo</Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assinaturas" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative flex-1 overflow-hidden rounded-xl md:min-h-min dark:border-sidebar-border">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        Minhas Assinaturas
                                    </CardTitle>
                                    <CardDescription>Gerencie suas assinaturas e formas de pagamento</CardDescription>
                                </div>
                                {getStatusBadge()}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Status da Assinatura</p>
                                        <p className="font-medium">
                                            {subscription_status.subscribed ? 'Ativo' : 'Inativo'}
                                        </p>
                                    </div>
                                    <Link href={subscriptionManage().url}>
                                        <Button className="gap-2">
                                            <Settings className="h-4 w-4" />
                                            Gerenciar Detalhes
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>

                                {subscription_status.on_trial && (
                                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                                        <p className="text-sm text-blue-900 dark:text-blue-100">
                                            🎉 Você está em período de teste! Aproveite todos os recursos premium.
                                        </p>
                                    </div>
                                )}

                                {subscription_status.cancelled && (
                                    <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                                        <p className="text-sm text-amber-900 dark:text-amber-100">
                                            ⚠️ Sua assinatura foi cancelada e expirará em{' '}
                                            {subscription_status.ends_at && new Date(subscription_status.ends_at).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                )}

                                {subscription_status.stripe_status && (
                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Status no Stripe</p>
                                            <p className="font-medium capitalize">{subscription_status.stripe_status}</p>
                                        </div>
                                        {subscription_status.ends_at && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    {subscription_status.on_trial ? 'Teste expira em' : 'Expira em'}
                                                </p>
                                                <p className="font-medium">
                                                    {new Date(subscription_status.ends_at).toLocaleDateString('pt-BR')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Forma de Pagamento</p>
                                        <p className="font-medium">
                                            {has_payment_method ? '✅ Cartão vinculado' : '❌ Nenhum cartão cadastrado'}
                                        </p>
                                    </div>
                                    {!has_payment_method && (
                                        <Button variant="outline">Adicionar Cartão</Button>
                                    )}
                                </div>
                            </div>

                        <ul>
                            {subscriptions.map(sub => (
                                <li key={sub.id}>{sub.plan_name}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppLayout>
    );
}