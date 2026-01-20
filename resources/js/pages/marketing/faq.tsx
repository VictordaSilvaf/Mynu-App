import { CTASection } from '@/components/marketing/cta-section';
import { Input } from '@/components/ui/input';
import MarketingLayout from '@/layouts/marketing-layout';
import { Head } from '@inertiajs/react';
import { Search, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function FAQ() {
    const [searchTerm, setSearchTerm] = useState('');

    const faqCategories = [
        {
            title: 'Primeiros Passos',
            icon: '🚀',
            faqs: [
                {
                    question: 'Como criar minha primeira conta no MYNU?',
                    answer: 'É muito simples! Clique em "Criar Conta" no topo da página, preencha seus dados e pronto. Você terá acesso imediato ao plano gratuito e poderá criar seu primeiro cardápio em minutos.',
                },
                {
                    question: 'Preciso de conhecimentos técnicos para usar o MYNU?',
                    answer: 'Não! O MYNU foi projetado para ser extremamente intuitivo. Se você sabe usar um smartphone, conseguirá criar e gerenciar seus cardápios sem problemas.',
                },
                {
                    question: 'Quanto tempo leva para configurar meu primeiro cardápio?',
                    answer: 'A maioria dos nossos usuários cria seu primeiro cardápio em menos de 15 minutos. Oferecemos templates prontos que você pode personalizar rapidamente.',
                },
            ],
        },
        {
            title: 'Planos e Pagamentos',
            icon: '💳',
            faqs: [
                {
                    question: 'Qual plano devo escolher?',
                    answer: 'Depende do seu negócio! O plano Free é perfeito para começar ou para pequenos estabelecimentos. O Pro é ideal para restaurantes em crescimento, e o Enterprise atende grandes operações com múltiplas unidades.',
                },
                {
                    question: 'Posso mudar de plano depois?',
                    answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças são aplicadas imediatamente e o valor é ajustado proporcionalmente.',
                },
                {
                    question: 'Como funciona o período de teste?',
                    answer: 'Todos os planos pagos incluem 14 dias de teste gratuito. Você não será cobrado durante o período de teste e pode cancelar a qualquer momento sem custos.',
                },
                {
                    question: 'Quais métodos de pagamento são aceitos?',
                    answer: 'Aceitamos cartões de crédito e débito das principais bandeiras (Visa, Mastercard, American Express). Para planos Enterprise, também oferecemos pagamento via boleto e transferência bancária.',
                },
                {
                    question: 'Posso cancelar a qualquer momento?',
                    answer: 'Sim, você pode cancelar sua assinatura a qualquer momento. Não há multas ou taxas de cancelamento. Após o cancelamento, você terá acesso aos recursos até o final do período já pago.',
                },
            ],
        },
        {
            title: 'Funcionalidades',
            icon: '⚡',
            faqs: [
                {
                    question: 'Como os clientes acessam meu cardápio digital?',
                    answer: 'Seus clientes podem acessar o cardápio escaneando um QR Code que você coloca nas mesas, ou através de um link que você pode compartilhar nas redes sociais, WhatsApp, etc.',
                },
                {
                    question: 'Posso personalizar o visual do meu cardápio?',
                    answer: 'Sim! Você pode escolher entre diversos templates, personalizar cores, fontes, adicionar seu logo e criar uma identidade visual única para seu estabelecimento.',
                },
                {
                    question: 'Como atualizar preços e itens?',
                    answer: 'É muito simples! Faça login na sua conta, vá até seu cardápio e edite qualquer item. As mudanças aparecem imediatamente para todos os clientes.',
                },
                {
                    question: 'O cardápio funciona offline?',
                    answer: 'Não, o cardápio precisa de conexão com a internet para ser acessado. Porém, ele carrega muito rápido mesmo em conexões lentas e é otimizado para consumir poucos dados.',
                },
                {
                    question: 'Posso ter múltiplos cardápios?',
                    answer: 'Sim! Dependendo do seu plano, você pode criar cardápios diferentes para almoço, jantar, drinks, eventos especiais, etc.',
                },
            ],
        },
        {
            title: 'Suporte e Segurança',
            icon: '🔒',
            faqs: [
                {
                    question: 'Meus dados estão seguros?',
                    answer: 'Absolutamente! Usamos criptografia de ponta a ponta e seguimos as melhores práticas de segurança da indústria. Seus dados são armazenados em servidores seguros e fazemos backups regulares.',
                },
                {
                    question: 'Como entrar em contato com o suporte?',
                    answer: 'Oferecemos suporte por email, chat e telefone. Clientes dos planos pagos têm acesso a suporte prioritário. Você pode nos contatar pela página de Contato.',
                },
                {
                    question: 'Vocês oferecem treinamento?',
                    answer: 'Sim! Oferecemos tutoriais em vídeo, documentação completa e, para clientes Enterprise, treinamento personalizado para sua equipe.',
                },
                {
                    question: 'O que acontece se eu tiver problemas técnicos?',
                    answer: 'Nossa equipe de suporte está pronta para ajudar! Respondemos todas as solicitações em até 24 horas, e clientes dos planos pagos têm suporte prioritário.',
                },
            ],
        },
        {
            title: 'Recursos Avançados',
            icon: '🎯',
            faqs: [
                {
                    question: 'Posso integrar com meu sistema de pedidos?',
                    answer: 'Sim! Planos Enterprise incluem acesso à API para integração com sistemas de pedidos, delivery e ERPs. Entre em contato para mais detalhes.',
                },
                {
                    question: 'Como funciona o Analytics?',
                    answer: 'Você pode acompanhar métricas como visualizações do cardápio, itens mais populares, horários de pico e muito mais. Planos Pro e Enterprise têm analytics mais detalhado.',
                },
                {
                    question: 'Posso ter múltiplos usuários gerenciando o cardápio?',
                    answer: 'Sim! Planos Pro e Enterprise permitem adicionar usuários com diferentes níveis de permissão (visualização, edição, administração).',
                },
                {
                    question: 'Vocês oferecem white-label?',
                    answer: 'Sim! O plano Enterprise inclui opção white-label, removendo nossa marca e permitindo você usar sua própria identidade visual completamente.',
                },
            ],
        },
    ];

    const filteredFaqs = faqCategories
        .map((category) => ({
            ...category,
            faqs: category.faqs.filter(
                (faq) =>
                    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        }))
        .filter((category) => category.faqs.length > 0);

    return (
        <MarketingLayout>
            <Head title="Perguntas Frequentes - MYNU">
                <meta
                    name="description"
                    content="Encontre respostas para as perguntas mais comuns sobre o MYNU. Aprenda mais sobre planos, funcionalidades e como começar."
                />
            </Head>

            <div className="min-h-screen bg-background">
                {/* Header */}
                <section className="border-b border-border bg-gradient-to-br from-background via-background to-muted/20 py-20">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-3xl text-center">
                            <HelpCircle className="mx-auto mb-6 size-16 text-primary" />
                            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                                Perguntas Frequentes
                            </h1>
                            <p className="mb-8 text-lg text-muted-foreground">
                                Encontre respostas rápidas para as dúvidas mais comuns sobre o MYNU
                            </p>

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Buscar perguntas..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Categories */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-4xl space-y-12">
                            {searchTerm && filteredFaqs.length === 0 ? (
                                <div className="text-center">
                                    <p className="text-muted-foreground">
                                        Nenhuma pergunta encontrada. Tente buscar com outras palavras-chave.
                                    </p>
                                </div>
                            ) : (
                                (searchTerm ? filteredFaqs : faqCategories).map((category, categoryIndex) => (
                                    <div key={categoryIndex}>
                                        <div className="mb-6 flex items-center gap-3">
                                            <span className="text-3xl">{category.icon}</span>
                                            <h2 className="text-2xl font-bold text-foreground">{category.title}</h2>
                                        </div>

                                        <div className="space-y-4">
                                            {category.faqs.map((faq, faqIndex) => (
                                                <details
                                                    key={faqIndex}
                                                    className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md"
                                                >
                                                    <summary className="cursor-pointer text-lg font-semibold text-foreground group-open:mb-3">
                                                        {faq.question}
                                                    </summary>
                                                    <p className="text-muted-foreground">{faq.answer}</p>
                                                </details>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* Still Have Questions */}
                <section className="border-y border-border bg-muted/30 py-16">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 className="mb-4 text-3xl font-bold text-foreground">Ainda tem dúvidas?</h2>
                            <p className="mb-8 text-lg text-muted-foreground">
                                Nossa equipe está pronta para ajudar você com qualquer questão
                            </p>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <a
                                    href="/contact"
                                    className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
                                >
                                    <HelpCircle className="mx-auto mb-3 size-8 text-primary" />
                                    <h3 className="mb-2 font-semibold text-foreground">Fale Conosco</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Entre em contato com nossa equipe de suporte
                                    </p>
                                </a>

                                <a
                                    href="/features"
                                    className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
                                >
                                    <Search className="mx-auto mb-3 size-8 text-primary" />
                                    <h3 className="mb-2 font-semibold text-foreground">Ver Recursos</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Conheça todas as funcionalidades do MYNU
                                    </p>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <CTASection
                    title="Pronto para começar?"
                    subtitle="Crie sua conta gratuita e veja como é fácil transformar seus cardápios"
                    primaryCta={{ text: 'Criar Conta Gratuita', href: '/register' }}
                    secondaryCta={{ text: 'Ver Planos', href: '/pricing' }}
                />
            </div>
        </MarketingLayout>
    );
}
