import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@inertiajs/core';
import { Head, router } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
    CheckCircle2, 
    XCircle, 
    Clock, 
    CreditCard, 
    ArrowUpCircle, 
    ArrowDownCircle,
    Calendar,
    Package,
    AlertCircle,
    Download,
    Settings,
    Shield
} from 'lucide-react';
import { index as subscriptionIndex } from '@/routes/subscription';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface SubscriptionStatus {
    subscribed: boolean;
    on_trial: boolean;
    on_grace_period: boolean;
    cancelled: boolean;
    ends_at: string | null;
    stripe_status: string | null;
}

interface Subscription {
    id: number;
    name: string;
    stripe_id: string;
    stripe_status: string;
    stripe_price: string;
    quantity: number;
    trial_ends_at: string | null;
    ends_at: string | null;
    created_at: string;
    updated_at: string;
}

interface Plan {
    name: string;
    description: string;
    monthlyPrice: number;
    yearlyPrice: number;
    features: Array<{ text: string; icon: string }>;
    isPopular?: boolean;
    isFree?: boolean;
}

interface Invoice {
    id: string;
    date: string;
    amount: number;
    status: string;
    invoice_pdf: string | null;
}

interface ManageProps extends PageProps {
    subscription: Subscription | null;
    subscription_status: SubscriptionStatus;
    current_plan: Plan | null;
    available_plans: Record<string, Plan>;
    has_payment_method: boolean;
    invoices: Invoice[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Assinatura',
        href: subscriptionIndex().url,
    },
    {
        title: 'Gerenciar',
        href: '#',
    },
];

export default function Manage({
    subscription,
    subscription_status,
    current_plan,
    available_plans,
    has_payment_method,
    invoices,
}: ManageProps) {
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);
    const [isResuming, setIsResuming] = useState(false);

    const handleCancelSubscription = () => {
        setIsCanceling(true);
        router.post(
            '/subscription/cancel',
            {},
            {
                onSuccess: () => {
                    setCancelDialogOpen(false);
                },
                onFinish: () => {
                    setIsCanceling(false);
                },
            }
        );
    };

    const handleResumeSubscription = () => {
        setIsResuming(true);
        router.post(
            '/subscription/resume',
            {},
            {
                onSuccess: () => {
                    setResumeDialogOpen(false);
                },
                onFinish: () => {
                    setIsResuming(false);
                },
            }
        );
    };

    const handleUpgrade = (planName: string) => {
        router.visit(`/payment/checkout?plan=${planName}&billing=monthly`);
    };

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
        return <Badge variant="secondary" className="gap-1"><AlertCircle className="h-3 w-3" /> Inativo</Badge>;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(amount);
    };

    const formatDate = (date: string | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gerenciar Assinatura" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Gerenciar Assinatura</h1>
                    <p className="text-muted-foreground">
                        Visualize e gerencie sua assinatura, plano e formas de pagamento
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content - Subscription Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Current Plan Card */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="h-5 w-5" />
                                            Plano Atual
                                        </CardTitle>
                                        <CardDescription>
                                            Detalhes da sua assinatura ativa
                                        </CardDescription>
                                    </div>
                                    {getStatusBadge()}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {current_plan && subscription ? (
                                    <>
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <h3 className="text-2xl font-bold capitalize">{current_plan.name}</h3>
                                                <p className="text-muted-foreground">{current_plan.description}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-bold">
                                                    {formatCurrency(current_plan.monthlyPrice)}
                                                </div>
                                                <div className="text-sm text-muted-foreground">por mês</div>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Subscription Info Grid */}
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-1">
                                                <div className="text-sm text-muted-foreground">Status</div>
                                                <div className="font-medium capitalize">{subscription.stripe_status}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-sm text-muted-foreground">ID da Assinatura</div>
                                                <div className="font-mono text-sm">{subscription.stripe_id}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-sm text-muted-foreground">Data de Início</div>
                                                <div className="font-medium">{formatDate(subscription.created_at)}</div>
                                            </div>
                                            {subscription_status.ends_at && (
                                                <div className="space-y-1">
                                                    <div className="text-sm text-muted-foreground">
                                                        {subscription_status.on_trial ? 'Teste Expira em' : 'Expira em'}
                                                    </div>
                                                    <div className="font-medium">{formatDate(subscription_status.ends_at)}</div>
                                                </div>
                                            )}
                                        </div>

                                        <Separator />

                                        {/* Features */}
                                        <div className="space-y-3">
                                            <h4 className="font-semibold">Recursos Incluídos</h4>
                                            <div className="grid gap-2 sm:grid-cols-2">
                                                {current_plan.features.map((feature, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                        <span className="text-sm">{feature.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Actions */}
                                        <div className="flex flex-wrap gap-3">
                                            {subscription_status.cancelled ? (
                                                <Button
                                                    onClick={() => setResumeDialogOpen(true)}
                                                    className="gap-2"
                                                    variant="default"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Reativar Assinatura
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => setCancelDialogOpen(true)}
                                                    variant="outline"
                                                    className="gap-2"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                    Cancelar Assinatura
                                                </Button>
                                            )}
                                            <Button variant="outline" className="gap-2">
                                                <Settings className="h-4 w-4" />
                                                Configurações
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8 space-y-4">
                                        <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                                        <div className="space-y-2">
                                            <h3 className="font-semibold">Nenhuma assinatura ativa</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Escolha um plano para começar a usar todos os recursos
                                            </p>
                                        </div>
                                        <Button onClick={() => router.visit('/pricing')}>
                                            Ver Planos Disponíveis
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Available Upgrades */}
                        {current_plan && !current_plan.isFree && Object.keys(available_plans).length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ArrowUpCircle className="h-5 w-5" />
                                        Upgrade de Plano
                                    </CardTitle>
                                    <CardDescription>
                                        Desbloqueie mais recursos atualizando seu plano
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {Object.entries(available_plans).map(([key, plan]) => {
                                        if (plan.name === current_plan.name) return null;
                                        
                                        const isUpgrade = plan.monthlyPrice > current_plan.monthlyPrice;
                                        const isDowngrade = plan.monthlyPrice < current_plan.monthlyPrice;

                                        return (
                                            <div
                                                key={key}
                                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-semibold capitalize">{plan.name}</h4>
                                                        {plan.isPopular && (
                                                            <Badge variant="secondary" className="text-xs">Popular</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                                                    <div className="text-lg font-bold">{formatCurrency(plan.monthlyPrice)}/mês</div>
                                                </div>
                                                <Button
                                                    onClick={() => handleUpgrade(plan.name)}
                                                    variant={isUpgrade ? 'default' : 'outline'}
                                                    className="gap-2"
                                                >
                                                    {isUpgrade ? (
                                                        <>
                                                            <ArrowUpCircle className="h-4 w-4" />
                                                            Fazer Upgrade
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ArrowDownCircle className="h-4 w-4" />
                                                            Trocar Plano
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        )}

                        {/* Billing History */}
                        {invoices && invoices.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Histórico de Cobrança
                                    </CardTitle>
                                    <CardDescription>
                                        Suas últimas faturas e pagamentos
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {invoices.map((invoice) => (
                                            <div
                                                key={invoice.id}
                                                className="flex items-center justify-between p-4 border rounded-lg"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-primary/10 rounded-lg">
                                                        <Calendar className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="font-medium">{formatDate(invoice.date)}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            Fatura #{invoice.id.slice(-8)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right space-y-1">
                                                        <div className="font-bold">{formatCurrency(invoice.amount)}</div>
                                                        <Badge
                                                            variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                                                            className="text-xs"
                                                        >
                                                            {invoice.status === 'paid' ? 'Pago' : invoice.status}
                                                        </Badge>
                                                    </div>
                                                    {invoice.invoice_pdf && (
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer">
                                                                <Download className="h-4 w-4" />
                                                            </a>
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Payment Method Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Forma de Pagamento
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {has_payment_method ? (
                                    <>
                                        <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <CreditCard className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium">Cartão cadastrado</div>
                                                <div className="text-sm text-muted-foreground">•••• •••• •••• ••••</div>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="w-full gap-2">
                                            <Settings className="h-4 w-4" />
                                            Atualizar Cartão
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-center py-4 space-y-2">
                                            <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">
                                                Nenhum cartão cadastrado
                                            </p>
                                        </div>
                                        <Button className="w-full gap-2">
                                            <CreditCard className="h-4 w-4" />
                                            Adicionar Cartão
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Security Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Segurança
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span>Pagamentos seguros via Stripe</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span>Criptografia SSL/TLS</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span>Cancele quando quiser</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Support Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Precisa de Ajuda?</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    Nossa equipe está pronta para ajudar com qualquer dúvida sobre sua assinatura
                                </p>
                                <Button variant="outline" className="w-full">
                                    Falar com Suporte
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Cancel Dialog */}
                <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Cancelar Assinatura</DialogTitle>
                            <DialogDescription>
                                Tem certeza que deseja cancelar sua assinatura? Você continuará tendo acesso aos recursos
                                até o final do período de cobrança atual.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 py-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <AlertCircle className="h-4 w-4" />
                                <span>Você perderá acesso aos recursos premium</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <AlertCircle className="h-4 w-4" />
                                <span>Seus dados serão preservados por 30 dias</span>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                                Manter Assinatura
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleCancelSubscription}
                                disabled={isCanceling}
                            >
                                {isCanceling ? 'Cancelando...' : 'Sim, Cancelar'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Resume Dialog */}
                <Dialog open={resumeDialogOpen} onOpenChange={setResumeDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reativar Assinatura</DialogTitle>
                            <DialogDescription>
                                Deseja reativar sua assinatura? Você voltará a ter acesso imediato a todos os recursos do plano.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setResumeDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleResumeSubscription} disabled={isResuming}>
                                {isResuming ? 'Reativando...' : 'Sim, Reativar'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
