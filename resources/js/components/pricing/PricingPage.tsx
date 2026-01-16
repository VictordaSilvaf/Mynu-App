import { useState } from "react";
import { PricingToggle } from "./PricingToggle";
import { PricingCard } from "./PricingCard";

const plans = {
    free: {
        name: "Free",
        description: "Comece grátis — sem custos, sem compromisso.",
        monthlyPrice: "R$0",
        yearlyPrice: "R$0",
        priceNote: "/mês",
        features: [
            { text: "Cardápio digital básico", icon: "layers" as const },
            { text: "Imagens 2D dos pratos", icon: "image" as const },
            { text: "Até 10 itens no cardápio", icon: "check" as const },
            { text: "Suporte por email", icon: "headphones" as const },
        ],
        buttonText: "Começar grátis",
        isCurrentPlan: true,
    },
    pro: {
        name: "Pro",
        description: "Potencialize seu cardápio com visualização 3D e analytics.",
        monthlyPrice: "R$49",
        yearlyPrice: "R$39",
        priceNote: "/mês",
        features: [
            { text: "Upload de pratos em 3D", icon: "sparkles" as const },
            { text: "Até 25 itens no cardápio", icon: "check" as const },
            { text: "Analytics básico", icon: "chart" as const },
            { text: "Personalização de cores", icon: "palette" as const },
            { text: "QR Code personalizado", icon: "qr" as const },
        ],
        buttonText: "Assinar Pro",
        isPopular: true,
    },
    enterprise: {
        name: "Enterprise",
        description: "Para redes que precisam de controle e escala.",
        monthlyPrice: "R$149",
        yearlyPrice: "R$119",
        priceNote: "/mês",
        features: [
            { text: "Até 50 itens no cardápio", icon: "check" as const },
            { text: "Analytics avançado", icon: "chart" as const },
            { text: "Múltiplos cardápios", icon: "layers" as const },
            { text: "Suporte prioritário 24/7", icon: "headphones" as const },
            { text: "Integrações personalizadas", icon: "sparkles" as const },
            { text: "Gerente de conta dedicado", icon: "users" as const },
        ],
        buttonText: "Falar com vendas",
    },
};

export function PricingPage() {
    const [isAnnual, setIsAnnual] = useState(false);

    const getPrice = (plan: keyof typeof plans) => {
        const planData = plans[plan];
        return isAnnual ? planData.yearlyPrice : planData.monthlyPrice;
    };

    const handlePlanClick = (planName: string) => {
        console.log(`Selected plan: ${planName}, billing: ${isAnnual ? 'annual' : 'monthly'}`);
    };

    return (
        <div className="bg-background px-4 py-4">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                        Planos & Preços
                    </h1>
                    <p className="mx-auto max-w-xl text-base text-muted-foreground">
                        Escolha o plano que se adapta às suas necessidades e cresça junto com seu restaurante.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="mb-10 flex justify-center">
                    <PricingToggle isAnnual={isAnnual} onToggle={setIsAnnual} />
                </div>

                {/* Pricing Cards */}
                <div className="grid gap-6 md:grid-cols-3 md:gap-6 lg:gap-8">
                    <div className="animate-fade-in [animation-delay:100ms]">
                        <PricingCard
                            {...plans.free}
                            price={getPrice("free")}
                            onButtonClick={() => handlePlanClick("free")}
                        />
                    </div>
                    <div className="animate-fade-in [animation-delay:200ms] md:-mt-4 md:mb-4">
                        <PricingCard
                            {...plans.pro}
                            price={getPrice("pro")}
                            onButtonClick={() => handlePlanClick("pro")}
                        />
                    </div>
                    <div className="animate-fade-in [animation-delay:300ms]">
                        <PricingCard
                            {...plans.enterprise}
                            price={getPrice("enterprise")}
                            onButtonClick={() => handlePlanClick("enterprise")}
                        />
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-muted-foreground">
                        Todos os planos incluem SSL grátis, atualizações automáticas e acesso à comunidade MYNU.
                    </p>
                </div>
            </div>
        </div>
    );
}
