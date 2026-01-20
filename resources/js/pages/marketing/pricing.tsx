import { PricingPage } from '@/components/pricing/PricingPage';
import { CTASection } from '@/components/marketing/cta-section';
import { StatsSection } from '@/components/marketing/stats-section';
import MarketingLayout from '@/layouts/marketing-layout';
import { type PlansMap } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import Menu from '@/components/ui/menu';
import Footer from '@/components/ui/footer';

interface PricingPageProps {
    plans: PlansMap;
}

export default function Pricing({ plans }: PricingPageProps) {
    const stats = [
        { value: '10K+', label: 'Restaurantes ativos' },
        { value: '50M+', label: 'Visualizações mensais' },
        { value: '99.9%', label: 'Uptime garantido' },
        { value: '4.9/5', label: 'Avaliação média' },
    ];

    return (
        <MarketingLayout>
            <Head title="Preços - MYNU">
                <meta
                    name="description"
                    content="Planos flexíveis para todos os tamanhos de negócio. Comece gratuitamente e escale conforme necessário."
                />
            </Head>

            <div className="bg-background">
                {/* Header Section */}
                <section className="border-b border-border bg-gradient-to-br from-background via-background to-muted/20 py-20">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                                Planos que crescem com seu negócio
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Comece gratuitamente e escolha o plano ideal quando estiver pronto para crescer.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <PricingPage plans={plans} />
                    </div>
                </section>

                {/* Comparison Table */}
                <section className="border-y border-border bg-muted/30 py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground">
                            Comparação Detalhada
                        </h2>

                        <div className="mx-auto max-w-5xl overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-border">
                                    <tr>
                                        <th className="px-4 py-4 text-sm font-semibold text-foreground">Recursos</th>
                                        <th className="px-4 py-4 text-center text-sm font-semibold text-foreground">
                                            Free
                                        </th>
                                        <th className="px-4 py-4 text-center text-sm font-semibold text-foreground">
                                            Pro
                                        </th>
                                        <th className="px-4 py-4 text-center text-sm font-semibold text-foreground">
                                            Enterprise
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    <tr>
                                        <td className="px-4 py-4 text-sm text-muted-foreground">Cardápios digitais</td>
                                        <td className="px-4 py-4 text-center text-sm">1</td>
                                        <td className="px-4 py-4 text-center text-sm">5</td>
                                        <td className="px-4 py-4 text-center text-sm">Ilimitados</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-4 text-sm text-muted-foreground">Itens no menu</td>
                                        <td className="px-4 py-4 text-center text-sm">20</td>
                                        <td className="px-4 py-4 text-center text-sm">
                                            <CheckCircle2 className="inline size-5 text-green-600" />
                                        </td>
                                        <td className="px-4 py-4 text-center text-sm">
                                            <CheckCircle2 className="inline size-5 text-green-600" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-4 text-sm text-muted-foreground">QR Code personalizado</td>
                                        <td className="px-4 py-4 text-center text-sm">-</td>
                                        <td className="px-4 py-4 text-center text-sm">
                                            <CheckCircle2 className="inline size-5 text-green-600" />
                                        </td>
                                        <td className="px-4 py-4 text-center text-sm">
                                            <CheckCircle2 className="inline size-5 text-green-600" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-4 text-sm text-muted-foreground">Analytics</td>
                                        <td className="px-4 py-4 text-center text-sm">-</td>
                                        <td className="px-4 py-4 text-center text-sm">Básico</td>
                                        <td className="px-4 py-4 text-center text-sm">Avançado</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-4 text-sm text-muted-foreground">Suporte</td>
                                        <td className="px-4 py-4 text-center text-sm">Email</td>
                                        <td className="px-4 py-4 text-center text-sm">Prioritário</td>
                                        <td className="px-4 py-4 text-center text-sm">24/7</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-4 text-sm text-muted-foreground">API Access</td>
                                        <td className="px-4 py-4 text-center text-sm">-</td>
                                        <td className="px-4 py-4 text-center text-sm">-</td>
                                        <td className="px-4 py-4 text-center text-sm">
                                            <CheckCircle2 className="inline size-5 text-green-600" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-4 text-sm text-muted-foreground">White-label</td>
                                        <td className="px-4 py-4 text-center text-sm">-</td>
                                        <td className="px-4 py-4 text-center text-sm">-</td>
                                        <td className="px-4 py-4 text-center text-sm">
                                            <CheckCircle2 className="inline size-5 text-green-600" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <StatsSection stats={stats} />

                {/* FAQ Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground">
                                Perguntas Frequentes
                            </h2>

                            <div className="space-y-4">
                                <details className="group rounded-lg border border-border bg-card p-6">
                                    <summary className="cursor-pointer font-semibold text-foreground">
                                        Posso mudar de plano a qualquer momento?
                                    </summary>
                                    <p className="mt-3 text-sm text-muted-foreground">
                                        Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As
                                        mudanças são aplicadas imediatamente e o valor é ajustado proporcionalmente.
                                    </p>
                                </details>

                                <details className="group rounded-lg border border-border bg-card p-6">
                                    <summary className="cursor-pointer font-semibold text-foreground">
                                        Como funciona o período de teste?
                                    </summary>
                                    <p className="mt-3 text-sm text-muted-foreground">
                                        Todos os planos pagos incluem 14 dias de teste gratuito. Você não será cobrado
                                        durante o período de teste e pode cancelar a qualquer momento.
                                    </p>
                                </details>

                                <details className="group rounded-lg border border-border bg-card p-6">
                                    <summary className="cursor-pointer font-semibold text-foreground">
                                        Quais métodos de pagamento são aceitos?
                                    </summary>
                                    <p className="mt-3 text-sm text-muted-foreground">
                                        Aceitamos cartões de crédito e débito das principais bandeiras (Visa, Mastercard,
                                        American Express). Para planos Enterprise, também oferecemos pagamento via boleto e
                                        transferência bancária.
                                    </p>
                                </details>

                                <details className="group rounded-lg border border-border bg-card p-6">
                                    <summary className="cursor-pointer font-semibold text-foreground">
                                        Posso cancelar minha assinatura?
                                    </summary>
                                    <p className="mt-3 text-sm text-muted-foreground">
                                        Sim, você pode cancelar sua assinatura a qualquer momento sem custos adicionais.
                                        Após o cancelamento, você terá acesso aos recursos até o final do período já pago.
                                    </p>
                                </details>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <CTASection
                    title="Pronto para começar?"
                    subtitle="Junte-se a milhares de restaurantes que já transformaram seus cardápios com o MYNU"
                    primaryCta={{ text: 'Começar Gratuitamente', href: '/register' }}
                    secondaryCta={{ text: 'Falar com Vendas', href: '/contact' }}
                />
            </div>
        </MarketingLayout>
    );
}
