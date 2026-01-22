import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle2, ArrowRight, Receipt, CreditCard, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { index as subscriptionIndex } from '@/routes/subscription';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY || '');

interface PaymentSuccessProps {
    plan?: string;
    billing?: string;
    subscription?: {
        id: string;
        plan: string;
        status: string;
        current_period_end: string;
    };
}

function PaymentSuccessContent({ plan, billing, subscription }: PaymentSuccessProps) {
    const stripe = useStripe();
    const [paymentStatus, setPaymentStatus] = useState<'loading' | 'succeeded' | 'processing' | 'failed'>('loading');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret');

        if (!clientSecret) {
            setPaymentStatus('succeeded');
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            if (!paymentIntent) {
                setPaymentStatus('failed');
                setError('Não foi possível verificar o status do pagamento.');
                return;
            }

            switch (paymentIntent.status) {
                case 'succeeded':
                    setPaymentStatus('succeeded');
                    break;
                case 'processing':
                    setPaymentStatus('processing');
                    break;
                case 'requires_payment_method':
                    setPaymentStatus('failed');
                    setError('O pagamento não foi concluído. Por favor, tente novamente.');
                    break;
                default:
                    setPaymentStatus('failed');
                    setError('Ocorreu um erro ao processar seu pagamento.');
                    break;
            }
        });
    }, [stripe]);

    const planNames: Record<string, string> = {
        free: 'Plano Gratuito',
        pro: 'Plano Pro',
        enterprise: 'Plano Enterprise',
    };

    const billingLabels: Record<string, string> = {
        monthly: 'Mensal',
        annual: 'Anual',
    };

    if (paymentStatus === 'loading') {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-muted-foreground">Verificando status do pagamento...</p>
                </div>
            </div>
        );
    }

    if (paymentStatus === 'failed') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                <div className="container mx-auto px-4 py-16">
                    <div className="mx-auto max-w-2xl">
                        <div className="rounded-xl border border-destructive/20 bg-card p-8 text-center shadow-sm">
                            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-destructive/10">
                                <AlertCircle className="size-8 text-destructive" />
                            </div>

                            <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                Pagamento Não Concluído
                            </h1>

                            <p className="mb-6 text-muted-foreground">{error}</p>

                            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                                <Button onClick={() => router.visit(subscriptionIndex().url)} size="lg">
                                    Tentar Novamente
                                </Button>
                                <Button variant="outline" onClick={() => router.visit(dashboard().url)} size="lg">
                                    Ir para Dashboard
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (paymentStatus === 'processing') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                <div className="container mx-auto px-4 py-16">
                    <div className="mx-auto max-w-2xl">
                        <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
                            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10">
                                <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                            </div>

                            <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                Pagamento em Processamento
                            </h1>

                            <p className="mb-6 text-muted-foreground">
                                Seu pagamento está sendo processado. Você receberá um email de confirmação em breve.
                            </p>

                            <Alert className="mb-6">
                                <AlertCircle />
                                <AlertTitle>Aguarde a confirmação</AlertTitle>
                                <AlertDescription>
                                    Isso pode levar alguns minutos. Não feche esta página até receber a confirmação.
                                </AlertDescription>
                            </Alert>

                            <Button onClick={() => router.visit(dashboard().url)} variant="outline" size="lg">
                                Ir para Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto px-4 py-16">
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
                        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                            <CheckCircle2 className="size-10 text-green-600 dark:text-green-500" />
                        </div>

                        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            Pagamento Confirmado!
                        </h1>

                        <p className="mb-8 text-lg text-muted-foreground">
                            Obrigado pela sua assinatura. Seu acesso foi ativado com sucesso.
                        </p>

                        <div className="mb-8 space-y-4">
                            <div className="rounded-lg border border-border bg-muted/50 p-6">
                                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    Detalhes da Assinatura
                                </h2>

                                <div className="space-y-3">
                                    {plan && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Plano</span>
                                            <span className="font-medium">{planNames[plan] || plan}</span>
                                        </div>
                                    )}

                                    {billing && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Cobrança</span>
                                            <span className="font-medium">{billingLabels[billing] || billing}</span>
                                        </div>
                                    )}

                                    {subscription && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">Status</span>
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                    <span className="size-1.5 rounded-full bg-green-600 dark:bg-green-400" />
                                                    Ativo
                                                </span>
                                            </div>

                                            {subscription.current_period_end && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">
                                                        Próxima renovação
                                                    </span>
                                                    <span className="font-medium">
                                                        {new Date(subscription.current_period_end).toLocaleDateString(
                                                            'pt-BR'
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <Alert>
                                <Receipt className="size-4" />
                                <AlertTitle>Recibo enviado</AlertTitle>
                                <AlertDescription>
                                    Um recibo foi enviado para o seu email com todos os detalhes da transação.
                                </AlertDescription>
                            </Alert>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                                <Button onClick={() => router.visit(dashboard().url)} size="lg">
                                    Ir para Dashboard
                                    <ArrowRight className="size-4" />
                                </Button>
                                <Button variant="outline" onClick={() => router.visit(subscriptionIndex().url)} size="lg">
                                    <CreditCard className="size-4" />
                                    Gerenciar Assinatura
                                </Button>
                            </div>

                            <p className="text-xs text-muted-foreground">
                                Precisa de ajuda?{' '}
                                <a href="#" className="underline hover:text-foreground">
                                    Entre em contato com o suporte
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccess(props: PaymentSuccessProps) {
    return (
        <>
            <Head title="Pagamento Confirmado" />
            <Elements stripe={stripePromise}>
                <PaymentSuccessContent {...props} />
            </Elements>
        </>
    );
}
