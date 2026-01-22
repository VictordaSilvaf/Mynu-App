import { useState } from "react";
import { PricingToggle } from "./PricingToggle";
import { PricingCard } from "./PricingCard";
import { router, usePage } from "@inertiajs/react";
import { PlansMap, SharedData } from "@/types";
import payment from "@/routes/payment";

export function PricingPage({
    plans,
}: {
    plans: PlansMap;
}) {
    const { auth } = usePage<SharedData>().props;
    const [isAnnual, setIsAnnual] = useState(false);

    const resolvePrice = (plan: PlansMap[keyof PlansMap], annual: boolean): number => {
        const monthly = plan.monthlyPrice ?? plan.price ?? 0;
        const yearly = plan.yearlyPrice ?? monthly;

        return annual ? yearly : monthly;
    };

    const handlePlanClick = (planName: string) => {
        if (planName === "free" || !auth.user) {
            router.visit("/login");
            return;
        }

        // Usa window.location para permitir redirect externo do Stripe
        const url = payment.checkout.url({ plan: planName, billing: isAnnual ? 'annual' : 'monthly' });
        window.location.href = url;
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

                <div className="mb-10 flex justify-center">
                    <PricingToggle isAnnual={isAnnual} onToggle={setIsAnnual} />
                </div>

                {/* Pricing Cards */}
                <div className="relative grid gap-6 md:grid-cols-3 md:gap-6 lg:gap-8">
                    <div className="animate-fade-in [animation-delay:100ms]">
                        <PricingCard
                            {...plans.free}
                            price={resolvePrice(plans.free, isAnnual)}
                            onButtonClick={() => handlePlanClick("free")}
                            roles={auth.roles}
                        />
                    </div>
                    <div className="animate-fade-in [animation-delay:200ms] md:-mt-4 md:mb-4">
                        <PricingCard
                            {...plans.pro}
                            price={resolvePrice(plans.pro, isAnnual)}
                            onButtonClick={() => handlePlanClick("pro")}
                            roles={auth.roles}
                        />
                    </div>
                    <div className="animate-fade-in [animation-delay:300ms]">
                        <PricingCard
                            {...plans.enterprise}
                            price={resolvePrice(plans.enterprise, isAnnual)}
                            onButtonClick={() => handlePlanClick("enterprise")}
                            roles={auth.roles}
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
