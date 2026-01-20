import { HeroSection } from '@/components/marketing/hero-section';
import { FeatureCard } from '@/components/marketing/feature-card';
import { CTASection } from '@/components/marketing/cta-section';
import { StatsSection } from '@/components/marketing/stats-section';
import { Head } from '@inertiajs/react';
import {
    Smartphone,
    QrCode,
    Palette,
    BarChart3,
    Globe,
    Zap,
    Shield,
    Users,
    Clock,
    Image as ImageIcon,
    Heart,
    Sparkles,
} from 'lucide-react';
import MarketingLayout from '@/layouts/marketing-layout';

export default function Features() {
    const mainFeatures = [
        {
            icon: Smartphone,
            title: 'Cardápios Digitais Interativos',
            description:
                'Crie cardápios digitais impressionantes que seus clientes podem acessar de qualquer dispositivo. Totalmente responsivo e otimizado para mobile.',
            variant: 'highlight' as const,
        },
        {
            icon: QrCode,
            title: 'QR Code Personalizado',
            description:
                'Gere QR Codes personalizados com sua identidade visual. Seus clientes escaneiam e acessam o cardápio instantaneamente.',
        },
        {
            icon: Palette,
            title: 'Templates Personalizáveis',
            description:
                'Escolha entre diversos templates profissionais ou crie seu próprio design. Personalize cores, fontes e layout.',
        },
        {
            icon: BarChart3,
            title: 'Analytics Detalhado',
            description:
                'Acompanhe visualizações, itens mais populares, horários de pico e muito mais. Tome decisões baseadas em dados reais.',
        },
        {
            icon: Globe,
            title: 'Multilíngue',
            description:
                'Ofereça seu cardápio em múltiplos idiomas. Ideal para estabelecimentos em áreas turísticas ou internacionais.',
        },
        {
            icon: Zap,
            title: 'Atualizações em Tempo Real',
            description:
                'Modifique preços, adicione ou remova itens instantaneamente. As mudanças aparecem imediatamente para todos os clientes.',
        },
    ];

    const additionalFeatures = [
        {
            icon: Shield,
            title: 'Seguro e Confiável',
            description: '99.9% de uptime garantido. Seus dados protegidos com criptografia de ponta a ponta.',
        },
        {
            icon: Users,
            title: 'Múltiplos Usuários',
            description: 'Adicione sua equipe com permissões personalizadas. Controle quem pode editar e visualizar.',
        },
        {
            icon: Clock,
            title: 'Horários Especiais',
            description: 'Configure menus diferentes para almoço, jantar, happy hour ou eventos especiais.',
        },
        {
            icon: ImageIcon,
            title: 'Galeria de Fotos',
            description: 'Adicione fotos profissionais dos seus pratos. Imagens otimizadas para carregamento rápido.',
        },
        {
            icon: Heart,
            title: 'Favoritos do Chef',
            description: 'Destaque seus melhores pratos e recomendações especiais de forma elegante.',
        },
        {
            icon: Sparkles,
            title: 'Categorias e Filtros',
            description: 'Organize seu menu por categorias, restrições alimentares, ingredientes e mais.',
        },
    ];

    const stats = [
        { value: '15 min', label: 'Tempo médio de setup' },
        { value: '300%', label: 'Aumento em visualizações' },
        { value: '45%', label: 'Redução em erros de pedido' },
        { value: '98%', label: 'Satisfação dos clientes' },
    ];

    return (
        <MarketingLayout>
            <Head title="Recursos - MYNU">
                <meta
                    name="description"
                    content="Descubra todos os recursos poderosos do MYNU para criar cardápios digitais impressionantes para seu restaurante."
                />
            </Head>

            <div className="min-h-screen bg-background">
                {/* Hero */}
                <HeroSection
                    badge="Recursos Completos"
                    title={
                        <>
                            Tudo que você precisa para criar
                            <br />
                            <span className="text-primary">cardápios incríveis</span>
                        </>
                    }
                    subtitle="Ferramentas profissionais, fáceis de usar e projetadas especificamente para o setor de alimentação."
                    primaryCta={{ text: 'Começar Gratuitamente', href: '/register' }}
                    secondaryCta={{ text: 'Ver Demonstração', href: '/contact' }}
                    Icon={Sparkles}
                />

                {/* Main Features */}
                <section className="py-20 max-w-7xl mx-auto">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                                Recursos Principais
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                Tudo que você precisa para criar, gerenciar e otimizar seus cardápios digitais em um só
                                lugar.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {mainFeatures.map((feature, index) => (
                                <FeatureCard key={index} {...feature} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <StatsSection
                    title="Resultados Comprovados"
                    stats={stats}
                />

                {/* Additional Features */}
                <section className="py-20 max-w-7xl mx-auto">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                                E muito mais...
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                Funcionalidades adicionais para elevar a experiência dos seus clientes.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {additionalFeatures.map((feature, index) => (
                                <FeatureCard key={index} {...feature} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Feature Highlights */}
                <section className="border-y border-border bg-muted/30 py-20 max-w-7xl mx-auto">
                    <div className="container mx-auto px-4">
                        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
                            {/* Feature 1 */}
                            <div className="space-y-6">
                                <div className="inline-flex rounded-lg bg-primary/10 p-3">
                                    <Smartphone className="size-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground">Design Responsivo Perfeito</h3>
                                <p className="text-muted-foreground">
                                    Seus cardápios ficam perfeitos em qualquer dispositivo. Seja no celular do cliente,
                                    tablet do garçom ou display da cozinha, a experiência é sempre impecável.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 rounded-full bg-primary/10 p-1">
                                            <div className="size-2 rounded-full bg-primary" />
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            Otimizado para telas de todos os tamanhos
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 rounded-full bg-primary/10 p-1">
                                            <div className="size-2 rounded-full bg-primary" />
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            Carregamento ultra-rápido mesmo em conexões lentas
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 rounded-full bg-primary/10 p-1">
                                            <div className="size-2 rounded-full bg-primary" />
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            Interface intuitiva e fácil de navegar
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            {/* Feature 2 */}
                            <div className="space-y-6">
                                <div className="inline-flex rounded-lg bg-primary/10 p-3">
                                    <BarChart3 className="size-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground">Insights Inteligentes</h3>
                                <p className="text-muted-foreground">
                                    Entenda o comportamento dos seus clientes com analytics detalhado. Descubra quais
                                    pratos são mais populares, horários de pico e muito mais.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 rounded-full bg-primary/10 p-1">
                                            <div className="size-2 rounded-full bg-primary" />
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            Visualizações em tempo real
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 rounded-full bg-primary/10 p-1">
                                            <div className="size-2 rounded-full bg-primary" />
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            Relatórios detalhados por período
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 rounded-full bg-primary/10 p-1">
                                            <div className="size-2 rounded-full bg-primary" />
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            Exportação de dados para análise externa
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <CTASection
                    title="Pronto para revolucionar seus cardápios?"
                    subtitle="Junte-se a milhares de restaurantes que já escolheram o MYNU"
                    primaryCta={{ text: 'Criar Conta Gratuita', href: '/register' }}
                    secondaryCta={{ text: 'Ver Planos', href: '/pricing' }}
                />
            </div>
        </MarketingLayout>
    );
}
