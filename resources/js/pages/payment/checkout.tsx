import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, type Appearance } from '@stripe/stripe-js';
import { AlertCircle, CheckCircle2, CreditCard, Lock, Shield } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { Head } from '@inertiajs/react';
import { CheckoutProvider } from '@stripe/react-stripe-js/checkout';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY || '');

interface PaymentProps {
    plan: string;
    billing: 'monthly' | 'annual';
    price_id: string;
    clientSecret?: string;
    amount?: number;
    currency?: string;
}

function CheckoutForm({ plan, billing, amount, currency }: Omit<PaymentProps, 'clientSecret' | 'price_id'>) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const { error: submitError } = await elements.submit();

            if (submitError) {
                setError(submitError.message || 'Erro ao processar pagamento');
                setIsProcessing(false);
                return;
            }

            const { error: confirmError } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/payment/success?plan=${plan}&billing=${billing}`,
                    receipt_email: email || undefined,
                },
            });

            if (confirmError) {
                setError(confirmError.message || 'Erro ao confirmar pagamento');
                setIsProcessing(false);
            }
        } catch (err) {
            setError('Erro inesperado ao processar pagamento');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle />
                    <AlertTitle>Erro no pagamento</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-bold text-foreground">
                        Email para recibo
                    </label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isProcessing}
                    />
                </div>

                <div>
                    <label className="mb-4 block text-sm font-bold text-foreground!">
                        Informações de pagamento
                    </label>
                    <PaymentElement
                        options={{
                            layout: 'tabs',
                        }}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <Button type="submit" disabled={isProcessing || !stripe || !elements} className="w-full" size="lg">
                    {isProcessing ? (
                        <>
                            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Processando...
                        </>
                    ) : (
                        <>
                            <Lock className="size-4" />
                            Pagar {amount && currency ? `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}` : ''}
                        </>
                    )}
                </Button>

                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Shield className="size-3" />
                        <span>Pagamento seguro</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Lock className="size-3" />
                        <span>SSL Criptografado</span>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default function Payment({ plan, billing, price_id, clientSecret, amount, currency }: PaymentProps) {
    const appearance: Appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: 'hsl(var(--primary))',
            colorBackground: 'hsl(var(--background))',
            colorText: 'hsl(var(--foreground))',
            colorDanger: 'hsl(var(--destructive))',
            fontFamily: 'system-ui, sans-serif',
            borderRadius: '0.5rem',
        },
    };

    const options = {
        clientSecret,
        appearance,
    };

    const planNames: Record<string, string> = {
        free: 'Plano Gratuito',
        pro: 'Plano Pro',
        enterprise: 'Plano Enterprise',
    };

    const billingLabels = {
        monthly: 'Mensal',
        annual: 'Anual',
    };

    return (
        <>
            <Head title={`Checkout - ${planNames[plan] || plan}`} />

            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-8 text-center">
                            <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                                Finalizar Pagamento
                            </h1>
                            <p className="text-muted-foreground">Complete sua assinatura de forma segura</p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-[1fr,400px]">
                            <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
                                <div className="mb-6 flex items-center gap-2 text-lg font-semibold">
                                    <CreditCard className="size-5" />
                                    Informações de Pagamento
                                </div>

                                {clientSecret ? (
                                    <Elements stripe={stripePromise} options={options}>
                                        <CheckoutForm
                                            plan={plan}
                                            billing={billing}
                                            amount={amount}
                                            currency={currency}
                                        />
                                    </Elements>
                                ) : (
                                    <Alert>
                                        <AlertCircle />
                                        <AlertTitle>Sessão de pagamento não encontrada</AlertTitle>
                                        <AlertDescription>
                                            Por favor, retorne à página de planos e tente novamente.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                    <h2 className="mb-4 font-semibold">Resumo do Pedido</h2>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Plano</span>
                                            <span className="font-medium">{planNames[plan] || plan}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Cobrança</span>
                                            <span className="font-medium">{billingLabels[billing]}</span>
                                        </div>

                                        {amount && currency && (
                                            <>
                                                <div className="my-3 border-t border-border" />

                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold">Total</span>
                                                    <span className="text-xl font-bold">
                                                        {currency === 'brl' && 'R$ '}
                                                        {(amount / 100).toFixed(2)}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                    <h3 className="mb-3 flex items-center gap-2 font-semibold">
                                        <CheckCircle2 className="size-4 text-green-600" />
                                        O que está incluído
                                    </h3>

                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                                            <span>Acesso imediato após confirmação</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                                            <span>Cancele a qualquer momento</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                                            <span>Suporte prioritário</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                                            <span>Atualizações automáticas</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="rounded-xl border border-muted bg-muted/50 p-4">
                                    <p className="text-xs text-muted-foreground">
                                        Ao prosseguir com o pagamento, você concorda com nossos{' '}
                                        <a href="#" className="underline hover:text-foreground">
                                            Termos de Serviço
                                        </a>{' '}
                                        e{' '}
                                        <a href="#" className="underline hover:text-foreground">
                                            Política de Privacidade
                                        </a>
                                        .
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
