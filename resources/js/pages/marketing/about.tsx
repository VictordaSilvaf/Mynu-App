import { HeroSection } from '@/components/marketing/hero-section';
import { StatsSection } from '@/components/marketing/stats-section';
import { TestimonialCard } from '@/components/marketing/testimonial-card';
import { CTASection } from '@/components/marketing/cta-section';
import { Head } from '@inertiajs/react';
import { Heart, Target, Users, Zap } from 'lucide-react';
import MarketingLayout from '@/layouts/marketing-layout';

export default function About() {
    const stats = [
        { value: '2020', label: 'Ano de fundação' },
        { value: '10K+', label: 'Restaurantes ativos' },
        { value: '50+', label: 'Países presentes' },
        { value: '98%', label: 'Satisfação dos clientes' },
    ];

    const values = [
        {
            icon: Heart,
            title: 'Paixão por Gastronomia',
            description:
                'Amamos comida e acreditamos que a experiência gastronômica começa no cardápio. Nossa missão é tornar cada interação memorável.',
        },
        {
            icon: Zap,
            title: 'Inovação Constante',
            description:
                'Estamos sempre evoluindo. Ouvimos nossos clientes e implementamos novos recursos para atender às necessidades do mercado.',
        },
        {
            icon: Users,
            title: 'Foco no Cliente',
            description:
                'Seu sucesso é nosso sucesso. Oferecemos suporte dedicado e ferramentas intuitivas para facilitar seu dia a dia.',
        },
        {
            icon: Target,
            title: 'Resultados Mensuráveis',
            description:
                'Fornecemos dados e insights para você tomar decisões inteligentes e aumentar suas vendas de forma consistente.',
        },
    ];

    const testimonials = [
        {
            quote: 'O MYNU transformou completamente a forma como apresentamos nosso menu. Nossos clientes adoram a facilidade de acessar o cardápio pelo celular.',
            author: 'Carlos Silva',
            role: 'Proprietário',
            company: 'Restaurante Sabor & Arte',
            rating: 5,
        },
        {
            quote: 'A plataforma é incrivelmente intuitiva. Conseguimos atualizar nosso cardápio em minutos e ver os resultados em tempo real através do analytics.',
            author: 'Marina Santos',
            role: 'Gerente',
            company: 'Bistrô da Marina',
            rating: 5,
        },
        {
            quote: 'Desde que adotamos os cardápios digitais do MYNU, reduzimos custos com impressão e nossos clientes estão mais satisfeitos. Recomendo!',
            author: 'Roberto Oliveira',
            role: 'Chef',
            company: 'Casa do Chef',
            rating: 5,
        },
    ];

    return (
        <MarketingLayout>
            <Head title="Sobre Nós - MYNU">
                <meta
                    name="description"
                    content="Conheça a história do MYNU e nossa missão de revolucionar a experiência gastronômica através de cardápios digitais inovadores."
                />
            </Head>

            <div className="min-h-screen bg-background">
                {/* Hero */}
                <HeroSection
                    badge="Nossa História"
                    title={
                        <>
                            Transformando cardápios em
                            <br />
                            <span className="text-primary">experiências digitais</span>
                        </>
                    }
                    subtitle="Nascemos da paixão por tecnologia e gastronomia. Nossa missão é ajudar restaurantes de todos os tamanhos a oferecer experiências digitais excepcionais."
                    primaryCta={{ text: 'Começar Agora', href: '/register' }}
                    secondaryCta={{ text: 'Falar Conosco', href: '/contact' }}
                    Icon={Heart}
                />

                {/* Mission & Vision */}
                <section className="py-14">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
                            <div className="space-y-6">
                                <div className="inline-flex rounded-lg bg-primary/10 p-3">
                                    <Target className="size-8 text-primary" />
                                </div>
                                <h2 className="text-3xl font-bold text-foreground">Nossa Missão</h2>
                                <p className="text-lg text-muted-foreground">
                                    Democratizar a tecnologia de cardápios digitais, tornando-a acessível para
                                    restaurantes de todos os tamanhos. Queremos que cada estabelecimento possa oferecer
                                    uma experiência moderna e profissional aos seus clientes, independentemente do
                                    tamanho do negócio.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="inline-flex rounded-lg bg-primary/10 p-3">
                                    <Zap className="size-8 text-primary" />
                                </div>
                                <h2 className="text-3xl font-bold text-foreground">Nossa Visão</h2>
                                <p className="text-lg text-muted-foreground">
                                    Ser a plataforma líder mundial em cardápios digitais, reconhecida pela qualidade,
                                    inovação e suporte excepcional. Queremos estar presentes em restaurantes ao redor do
                                    mundo, facilitando a vida de proprietários e encantando milhões de clientes.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <StatsSection title="MYNU em Números" stats={stats} />

                {/* Values */}
                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                                Nossos Valores
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                Os princípios que guiam tudo o que fazemos
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {values.map((value, index) => (
                                <div key={index} className="space-y-4 text-center">
                                    <div className="mx-auto inline-flex rounded-lg bg-primary/10 p-4">
                                        <value.icon className="size-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground">{value.title}</h3>
                                    <p className="text-sm text-muted-foreground">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="border-y border-border bg-muted/30 py-20">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                                O que dizem sobre nós
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                Histórias reais de restaurantes que transformaram seus negócios com o MYNU
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            {testimonials.map((testimonial, index) => (
                                <TestimonialCard key={index} {...testimonial} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team */}
                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                                Nossa Equipe
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                Um time apaixonado por tecnologia e gastronomia, trabalhando para criar as melhores
                                soluções para o seu negócio
                            </p>
                        </div>

                        <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-8 text-center">
                            <Users className="mx-auto mb-4 size-12 text-primary" />
                            <p className="text-muted-foreground">
                                Nossa equipe é formada por desenvolvedores, designers e especialistas em gastronomia,
                                todos unidos pelo objetivo de criar a melhor plataforma de cardápios digitais do mercado.
                            </p>
                            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                                <span>🇧🇷 Brasil</span>
                                <span>•</span>
                                <span>🇵🇹 Portugal</span>
                                <span>•</span>
                                <span>🇺🇸 Estados Unidos</span>
                                <span>•</span>
                                <span>🇲🇽 México</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <CTASection
                    title="Pronto para fazer parte da nossa história?"
                    subtitle="Junte-se a milhares de restaurantes que já escolheram o MYNU"
                    primaryCta={{ text: 'Criar Conta Gratuita', href: '/register' }}
                    secondaryCta={{ text: 'Conhecer a Equipe', href: '/contact' }}
                />
            </div>
        </MarketingLayout>
    );
}
