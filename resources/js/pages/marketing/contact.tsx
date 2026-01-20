import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Head } from '@inertiajs/react';
import { Mail, MessageSquare, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import MarketingLayout from '@/layouts/marketing-layout';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Simulação de envio - você pode integrar com seu backend aqui
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

            setTimeout(() => setIsSuccess(false), 5000);
        }, 1500);
    };

    const contactMethods = [
        {
            icon: Mail,
            title: 'Email',
            value: 'contato@mynu.com',
            description: 'Resposta em até 24h',
            href: 'mailto:contato@mynu.com',
        },
        {
            icon: Phone,
            title: 'Telefone',
            value: '+55 (11) 98765-4321',
            description: 'Seg-Sex, 9h-18h',
            href: 'tel:+5511987654321',
        },
        {
            icon: MessageSquare,
            title: 'Chat',
            value: 'Chat ao vivo',
            description: 'Disponível 24/7',
            href: '#',
        },
        {
            icon: MapPin,
            title: 'Escritório',
            value: 'São Paulo, Brasil',
            description: 'Av. Paulista, 1000',
            href: '#',
        },
    ];

    return (
        <MarketingLayout>
            <Head title="Contato - MYNU">
                <meta
                    name="description"
                    content="Entre em contato conosco. Nossa equipe está pronta para ajudar você a transformar seus cardápios."
                />
            </Head>

            <div className="min-h-screen bg-background">
                {/* Header */}
                <section className="border-b border-border bg-gradient-to-br from-background via-background to-muted/20 py-20">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                                Vamos conversar?
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Nossa equipe está pronta para ajudar você a transformar seus cardápios digitais.
                                Escolha a melhor forma de entrar em contato.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Methods */}
                <section className="py-12">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {contactMethods.map((method, index) => (
                                <a
                                    key={index}
                                    href={method.href}
                                    className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
                                >
                                    <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                                        <method.icon className="size-6 text-primary" />
                                    </div>
                                    <h3 className="mb-1 font-semibold text-foreground">{method.title}</h3>
                                    <p className="mb-2 text-sm text-muted-foreground">{method.value}</p>
                                    <p className="text-xs text-muted-foreground">{method.description}</p>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Form */}
                <section className="py-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-24">
                            {/* Form */}
                            <div>
                                <h2 className="mb-2 text-2xl font-bold text-foreground">Envie uma mensagem</h2>
                                <p className="mb-6 text-muted-foreground">
                                    Preencha o formulário abaixo e entraremos em contato em breve.
                                </p>

                                {isSuccess && (
                                    <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                                        <CheckCircle2 className="size-4 text-green-600" />
                                        <AlertDescription className="text-green-800 dark:text-green-200">
                                            Mensagem enviada com sucesso! Entraremos em contato em breve.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {error && (
                                    <Alert variant="destructive" className="mb-6">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="mb-2 block text-sm font-medium text-foreground"
                                            >
                                                Nome *
                                            </label>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="Seu nome completo"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="mb-2 block text-sm font-medium text-foreground"
                                            >
                                                Email *
                                            </label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="seu@email.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="phone"
                                                className="mb-2 block text-sm font-medium text-foreground"
                                            >
                                                Telefone
                                            </label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="(00) 00000-0000"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="subject"
                                                className="mb-2 block text-sm font-medium text-foreground"
                                            >
                                                Assunto *
                                            </label>
                                            <Input
                                                id="subject"
                                                type="text"
                                                placeholder="Como podemos ajudar?"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="mb-2 block text-sm font-medium text-foreground"
                                        >
                                            Mensagem *
                                        </label>
                                        <textarea
                                            id="message"
                                            rows={6}
                                            placeholder="Descreva sua dúvida ou necessidade..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            required
                                            disabled={isSubmitting}
                                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                        />
                                    </div>

                                    <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
                                        {isSubmitting ? (
                                            <>
                                                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="size-4" />
                                                Enviar Mensagem
                                            </>
                                        )}
                                    </Button>

                                    <p className="text-xs text-muted-foreground">
                                        * Campos obrigatórios. Responderemos em até 24 horas úteis.
                                    </p>
                                </form>
                            </div>

                            {/* Info */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="mb-4 text-xl font-semibold text-foreground">Perguntas Frequentes</h3>
                                    <div className="space-y-4">
                                        <details className="group rounded-lg border border-border bg-card p-4">
                                            <summary className="cursor-pointer text-sm font-medium text-foreground">
                                                Qual o tempo de resposta?
                                            </summary>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Respondemos todas as mensagens em até 24 horas úteis. Para casos
                                                urgentes, recomendamos usar o chat ao vivo.
                                            </p>
                                        </details>

                                        <details className="group rounded-lg border border-border bg-card p-4">
                                            <summary className="cursor-pointer text-sm font-medium text-foreground">
                                                Como funciona o suporte?
                                            </summary>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Oferecemos suporte por email, chat e telefone. Clientes dos planos pagos
                                                têm acesso a suporte prioritário.
                                            </p>
                                        </details>

                                        <details className="group rounded-lg border border-border bg-card p-4">
                                            <summary className="cursor-pointer text-sm font-medium text-foreground">
                                                Posso agendar uma demonstração?
                                            </summary>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Sim! Entre em contato conosco e nossa equipe agendará uma demonstração
                                                personalizada da plataforma.
                                            </p>
                                        </details>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-border bg-muted/30 p-6">
                                    <h3 className="mb-4 font-semibold text-foreground">Vendas & Parcerias</h3>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        Interessado em planos Enterprise ou parcerias comerciais?
                                    </p>
                                    <Button variant="outline" className="w-full" asChild>
                                        <a href="mailto:vendas@mynu.com">
                                            <Mail className="size-4" />
                                            vendas@mynu.com
                                        </a>
                                    </Button>
                                </div>

                                <div className="rounded-xl border border-border bg-muted/30 p-6">
                                    <h3 className="mb-4 font-semibold text-foreground">Trabalhe Conosco</h3>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        Quer fazer parte da nossa equipe? Confira as vagas abertas.
                                    </p>
                                    <Button variant="outline" className="w-full" asChild>
                                        <a href="mailto:rh@mynu.com">
                                            <Mail className="size-4" />
                                            Ver Vagas
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </MarketingLayout>
    );
}
