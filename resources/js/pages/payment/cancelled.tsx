import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { dashboard } from '@/routes';
import { Head, router } from '@inertiajs/react';
import { XCircle, AlertCircle, ArrowLeft, Mail } from 'lucide-react';
import { index } from '@/routes/subscription';

interface PaymentCancelledProps {
    reason?: string;
    plan?: string;
    billing?: string;
}

export default function PaymentCancelled({ reason, plan, billing }: PaymentCancelledProps) {
    const planNames: Record<string, string> = {
        free: 'Plano Gratuito',
        pro: 'Plano Pro',
        enterprise: 'Plano Enterprise',
    };

    const billingLabels: Record<string, string> = {
        monthly: 'Mensal',
        annual: 'Anual',
    };

    const reasons: Record<string, { title: string; description: string }> = {
        user_cancelled: {
            title: 'Pagamento Cancelado',
            description: 'Você cancelou o processo de pagamento. Nenhuma cobrança foi realizada.',
        },
        payment_failed: {
            title: 'Pagamento Não Aprovado',
            description:
                'Não foi possível processar seu pagamento. Verifique os dados do cartão e tente novamente.',
        },
        insufficient_funds: {
            title: 'Saldo Insuficiente',
            description: 'O cartão não possui saldo suficiente para completar a transação.',
        },
        card_declined: {
            title: 'Cartão Recusado',
            description: 'Seu cartão foi recusado. Entre em contato com seu banco para mais informações.',
        },
        expired_card: {
            title: 'Cartão Expirado',
            description: 'O cartão utilizado está vencido. Por favor, utilize outro cartão.',
        },
        processing_error: {
            title: 'Erro no Processamento',
            description: 'Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.',
        },
    };

    const currentReason = reason && reasons[reason] ? reasons[reason] : reasons.payment_failed;

    return (
        <>
            <Head title="Pagamento Cancelado" />

            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                <div className="container mx-auto px-4 py-16">
                    <div className="mx-auto max-w-2xl">
                        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                            <div className="text-center">
                                <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-destructive/10">
                                    <XCircle className="size-10 text-destructive" />
                                </div>

                                <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                                    {currentReason.title}
                                </h1>

                                <p className="mb-8 text-lg text-muted-foreground">{currentReason.description}</p>
                            </div>

                            {(plan || billing) && (
                                <div className="mb-8 rounded-lg border border-border bg-muted/50 p-6">
                                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                        Detalhes do Pedido
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
                                    </div>
                                </div>
                            )}

                            <div className="mb-8 space-y-4">
                                <Alert>
                                    <AlertCircle />
                                    <AlertTitle>O que aconteceu?</AlertTitle>
                                    <AlertDescription>
                                        Nenhuma cobrança foi realizada em seu cartão. Seus dados estão seguros e você
                                        pode tentar novamente quando quiser.
                                    </AlertDescription>
                                </Alert>

                                <Alert>
                                    <AlertCircle />
                                    <AlertTitle>Como resolver?</AlertTitle>
                                    <AlertDescription>
                                        <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                                            <li>Verifique se os dados do cartão estão corretos</li>
                                            <li>Confirme se o cartão possui saldo suficiente</li>
                                            <li>Tente usar outro cartão de crédito</li>
                                            <li>Entre em contato com seu banco se o problema persistir</li>
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                                    <Button
                                        onClick={() => {
                                            if (plan && billing) {
                                                window.history.back();
                                            } else {
                                                router.visit(index().url);
                                            }
                                        }}
                                        size="lg"
                                    >
                                        <ArrowLeft className="size-4" />
                                        Tentar Novamente
                                    </Button>
                                    <Button variant="outline" onClick={() => router.visit(dashboard().url)} size="lg">
                                        Ir para Dashboard
                                    </Button>
                                </div>

                                <div className="text-center">
                                    <p className="mb-2 text-sm text-muted-foreground">Precisa de ajuda?</p>
                                    <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                                        <Button variant="ghost" size="sm" asChild>
                                            <a href="mailto:suporte@mynu.com">
                                                <Mail className="size-4" />
                                                suporte@mynu.com
                                            </a>
                                        </Button>
                                        <span className="text-muted-foreground">ou</span>
                                        <Button variant="ghost" size="sm" asChild>
                                            <a href="#">Chat ao vivo</a>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-lg border border-muted bg-muted/30 p-4">
                            <h3 className="mb-2 font-medium">Dúvidas frequentes</h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <details className="group">
                                    <summary className="cursor-pointer font-medium text-foreground hover:text-primary">
                                        Por que meu pagamento foi recusado?
                                    </summary>
                                    <p className="mt-2 pl-4">
                                        Pagamentos podem ser recusados por diversos motivos: saldo insuficiente, dados
                                        incorretos, cartão vencido, ou bloqueio pelo banco. Entre em contato com sua
                                        instituição financeira para mais detalhes.
                                    </p>
                                </details>
                                <details className="group">
                                    <summary className="cursor-pointer font-medium text-foreground hover:text-primary">
                                        Fui cobrado mesmo com o erro?
                                    </summary>
                                    <p className="mt-2 pl-4">
                                        Não. Se o pagamento falhou, nenhuma cobrança foi realizada. Caso veja alguma
                                        pendência, é apenas uma pré-autorização que será estornada automaticamente em
                                        até 7 dias úteis.
                                    </p>
                                </details>
                                <details className="group">
                                    <summary className="cursor-pointer font-medium text-foreground hover:text-primary">
                                        Posso usar outro método de pagamento?
                                    </summary>
                                    <p className="mt-2 pl-4">
                                        Sim! Você pode tentar com outro cartão de crédito ou entrar em contato com
                                        nosso suporte para verificar outras opções disponíveis.
                                    </p>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
