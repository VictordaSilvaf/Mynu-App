import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { dashboard, monthlyfee } from '@/routes';
import { Head, router } from '@inertiajs/react';
import { useStripe } from '@stripe/react-stripe-js';
import { Elements, loadStripe } from '@stripe/stripe-js';
import { AlertCircle, CreditCard, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY || '');

interface PaymentProcessingProps {
    payment_intent_id?: string;
    setup_intent_id?: string;
    return_url?: string;
}

function PaymentProcessingContent({ payment_intent_id, setup_intent_id, return_url }: PaymentProcessingProps) {
    const stripe = useStripe();
    const [status, setStatus] = useState<'loading' | 'processing' | 'requires_action' | 'succeeded' | 'failed'>(
        'loading'
    );
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string>('Verificando status do pagamento...');

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const handlePaymentIntent = async () => {
            if (!payment_intent_id) {
                setStatus('failed');
                setError('ID do pagamento não encontrado');
                return;
            }

            try {
                const { paymentIntent } = await stripe.retrievePaymentIntent(payment_intent_id);

                if (!paymentIntent) {
                    setStatus('failed');
                    setError('Pagamento não encontrado');
                    return;
                }

                switch (paymentIntent.status) {
                    case 'requires_action':
                    case 'requires_confirmation':
                        setStatus('requires_action');
                        setMessage('Aguardando autenticação...');

                        const { error: confirmError } = await stripe.confirmPayment({
                            clientSecret: paymentIntent.client_secret!,
                            confirmParams: {
                                return_url: return_url || `${window.location.origin}/payment/success`,
                            },
                        });

                        if (confirmError) {
                            setStatus('failed');
                            setError(confirmError.message || 'Erro ao confirmar pagamento');
                        }
                        break;

                    case 'succeeded':
                        setStatus('succeeded');
                        setMessage('Pagamento confirmado com sucesso!');
                        setTimeout(() => {
                            router.visit(return_url || dashboard().url);
                        }, 2000);
                        break;

                    case 'processing':
                        setStatus('processing');
                        setMessage('Seu pagamento está sendo processado...');
                        break;

                    case 'requires_payment_method':
                    case 'canceled':
                        setStatus('failed');
                        setError('O pagamento foi cancelado ou requer um novo método de pagamento');
                        break;

                    default:
                        setStatus('failed');
                        setError('Status de pagamento desconhecido');
                }
            } catch (err) {
                setStatus('failed');
                setError('Erro ao verificar status do pagamento');
            }
        };

        const handleSetupIntent = async () => {
            if (!setup_intent_id) {
                setStatus('failed');
                setError('ID da configuração não encontrado');
                return;
            }

            try {
                const { setupIntent } = await stripe.retrieveSetupIntent(setup_intent_id);

                if (!setupIntent) {
                    setStatus('failed');
                    setError('Configuração não encontrada');
                    return;
                }

                switch (setupIntent.status) {
                    case 'requires_action':
                    case 'requires_confirmation':
                        setStatus('requires_action');
                        setMessage('Aguardando autenticação...');

                        const { error: confirmError } = await stripe.confirmSetup({
                            clientSecret: setupIntent.client_secret!,
                            confirmParams: {
                                return_url: return_url || `${window.location.origin}/payment-methods`,
                            },
                        });

                        if (confirmError) {
                            setStatus('failed');
                            setError(confirmError.message || 'Erro ao confirmar método de pagamento');
                        }
                        break;

                    case 'succeeded':
                        setStatus('succeeded');
                        setMessage('Método de pagamento adicionado com sucesso!');
                        setTimeout(() => {
                            router.visit(return_url || '/payment-methods');
                        }, 2000);
                        break;

                    case 'processing':
                        setStatus('processing');
                        setMessage('Processando método de pagamento...');
                        break;

                    case 'requires_payment_method':
                    case 'canceled':
                        setStatus('failed');
                        setError('A configuração foi cancelada ou requer um novo método de pagamento');
                        break;

                    default:
                        setStatus('failed');
                        setError('Status de configuração desconhecido');
                }
            } catch (err) {
                setStatus('failed');
                setError('Erro ao verificar status da configuração');
            }
        };

        if (payment_intent_id) {
            handlePaymentIntent();
        } else if (setup_intent_id) {
            handleSetupIntent();
        } else {
            setStatus('failed');
            setError('Nenhum ID de pagamento ou configuração fornecido');
        }
    }, [stripe, payment_intent_id, setup_intent_id, return_url]);

    if (status === 'loading' || status === 'processing' || status === 'requires_action') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                <div className="container mx-auto px-4 py-16">
                    <div className="mx-auto max-w-2xl">
                        <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
                            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-primary/10">
                                <div className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                            </div>

                            <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                {status === 'requires_action' ? 'Autenticação Necessária' : 'Processando Pagamento'}
                            </h1>

                            <p className="mb-8 text-lg text-muted-foreground">{message}</p>

                            <Alert>
                                <Shield />
                                <AlertTitle>Pagamento Seguro</AlertTitle>
                                <AlertDescription>
                                    {status === 'requires_action'
                                        ? 'Seu banco solicitou autenticação adicional. Por favor, complete a verificação na janela que se abriu.'
                                        : 'Aguarde enquanto processamos sua transação. Não feche esta página.'}
                                </AlertDescription>
                            </Alert>

                            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <CreditCard className="size-4" />
                                <span>Powered by Stripe</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'succeeded') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                <div className="container mx-auto px-4 py-16">
                    <div className="mx-auto max-w-2xl">
                        <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
                            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                <CreditCard className="size-10 text-green-600 dark:text-green-500" />
                            </div>

                            <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                Confirmado!
                            </h1>

                            <p className="mb-6 text-lg text-muted-foreground">{message}</p>

                            <p className="text-sm text-muted-foreground">Redirecionando...</p>
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
                    <div className="rounded-xl border border-destructive/20 bg-card p-8 text-center shadow-sm">
                        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-destructive/10">
                            <AlertCircle className="size-10 text-destructive" />
                        </div>

                        <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            Erro no Processamento
                        </h1>

                        <p className="mb-8 text-lg text-muted-foreground">{error}</p>

                        <Alert variant="destructive" className="mb-8">
                            <AlertCircle />
                            <AlertTitle>O que fazer?</AlertTitle>
                            <AlertDescription>
                                Verifique seus dados de pagamento e tente novamente. Se o problema persistir, entre em
                                contato com o suporte.
                            </AlertDescription>
                        </Alert>

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Button onClick={() => window.history.back()} size="lg">
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

export default function PaymentProcessing(props: PaymentProcessingProps) {
    return (
        <>
            <Head title="Processando Pagamento" />
            <Elements stripe={stripePromise}>
                <PaymentProcessingContent {...props} />
            </Elements>
        </>
    );
}
