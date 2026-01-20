import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { update, destroy } from '@/actions/App/Http/Controllers/Subscription/PaymentMethodController';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, type Appearance } from '@stripe/stripe-js';
import { AlertCircle, Check, CreditCard, Plus, Trash2, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY || '');

interface PaymentMethod {
    id: string;
    type: string;
    card?: {
        brand: string;
        last4: string;
        exp_month: number;
        exp_year: number;
    };
}

interface PaymentMethodsProps {
    intent: {
        client_secret: string;
    };
    payment_methods: PaymentMethod[];
    default_payment_method?: PaymentMethod;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configurações',
        href: '/settings',
    },
    {
        title: 'Métodos de Pagamento',
        href: '/payment-methods',
    },
];

function AddPaymentMethodForm({ onSuccess }: { onSuccess: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                setError(submitError.message || 'Erro ao validar método de pagamento');
                setIsProcessing(false);
                return;
            }

            const { error: setupError, setupIntent } = await stripe.confirmSetup({
                elements,
                redirect: 'if_required',
            });

            if (setupError) {
                setError(setupError.message || 'Erro ao adicionar método de pagamento');
                setIsProcessing(false);
                return;
            }

            if (setupIntent?.payment_method) {
                try {
                    await router.post(
                        update().url,
                        {
                            payment_method_id: setupIntent.payment_method,
                            set_as_default: true,
                        },
                        {
                            preserveState: true,
                            preserveScroll: true,
                            onSuccess: () => {
                                onSuccess();
                                setIsProcessing(false);
                            },
                            onError: () => {
                                setError('Erro ao salvar método de pagamento');
                                setIsProcessing(false);
                            },
                        }
                    );
                } catch (err) {
                    setError('Erro ao salvar método de pagamento');
                    setIsProcessing(false);
                }
            }
        } catch (err) {
            setError('Erro inesperado ao processar método de pagamento');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <PaymentElement
                options={{
                    layout: 'tabs',
                }}
            />

            <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => onSuccess()} disabled={isProcessing}>
                    <X className="size-4" />
                    Cancelar
                </Button>
                <Button type="submit" disabled={isProcessing || !stripe || !elements}>
                    {isProcessing ? (
                        <>
                            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Processando...
                        </>
                    ) : (
                        <>
                            <Check className="size-4" />
                            Adicionar Cartão
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}

function PaymentMethodCard({
    paymentMethod,
    isDefault,
    onDelete,
}: {
    paymentMethod: PaymentMethod;
    isDefault: boolean;
    onDelete: (id: string) => void;
}) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja remover este método de pagamento?')) {
            return;
        }

        setIsDeleting(true);

        router.delete(destroy({ paymentMethodId: paymentMethod.id }).url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                onDelete(paymentMethod.id);
            },
            onError: () => {
                setIsDeleting(false);
                alert('Erro ao remover método de pagamento');
            },
        });
    };

    const cardBrandImages: Record<string, string> = {
        visa: '🟦',
        mastercard: '🔴',
        amex: '🟩',
        discover: '🟧',
    };

    return (
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                    <CreditCard className="size-6 text-muted-foreground" />
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-medium">
                            {cardBrandImages[paymentMethod.card?.brand || ''] || '💳'}{' '}
                            {paymentMethod.card?.brand.toUpperCase()} •••• {paymentMethod.card?.last4}
                        </p>
                        {isDefault && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                <Check className="size-3" />
                                Padrão
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Expira em {String(paymentMethod.card?.exp_month).padStart(2, '0')}/
                        {paymentMethod.card?.exp_year}
                    </p>
                </div>
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting || isDefault}
                title={isDefault ? 'Não é possível remover o método de pagamento padrão' : 'Remover'}
            >
                {isDeleting ? (
                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                    <Trash2 className="size-4 text-destructive" />
                )}
            </Button>
        </div>
    );
}

export default function PaymentMethods({ intent, payment_methods, default_payment_method }: PaymentMethodsProps) {
    const [showAddForm, setShowAddForm] = useState(false);

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
        clientSecret: intent.client_secret,
        appearance,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Métodos de Pagamento" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-auto p-4">
                <div className="mx-auto w-full max-w-4xl space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Métodos de Pagamento</h1>
                        <p className="text-muted-foreground">
                            Gerencie seus cartões de crédito e métodos de pagamento
                        </p>
                    </div>

                    {!showAddForm && (
                        <Button onClick={() => setShowAddForm(true)}>
                            <Plus className="size-4" />
                            Adicionar Novo Cartão
                        </Button>
                    )}

                    {showAddForm && (
                        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold">Adicionar Novo Cartão</h2>
                            <Elements stripe={stripePromise} options={options}>
                                <AddPaymentMethodForm onSuccess={() => setShowAddForm(false)} />
                            </Elements>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Seus Cartões</h2>

                        {payment_methods.length === 0 ? (
                            <Alert>
                                <AlertCircle />
                                <AlertTitle>Nenhum cartão cadastrado</AlertTitle>
                                <AlertDescription>
                                    Adicione um cartão de crédito para gerenciar suas assinaturas e pagamentos.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <div className="space-y-3">
                                {payment_methods.map((paymentMethod) => (
                                    <PaymentMethodCard
                                        key={paymentMethod.id}
                                        paymentMethod={paymentMethod}
                                        isDefault={paymentMethod.id === default_payment_method?.id}
                                        onDelete={() => {
                                            router.reload({ preserveState: true, preserveScroll: true });
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <Alert>
                        <AlertCircle />
                        <AlertTitle>Segurança</AlertTitle>
                        <AlertDescription>
                            Seus dados de pagamento são processados de forma segura através do Stripe. Não armazenamos
                            informações completas do cartão em nossos servidores.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        </AppLayout>
    );
}
