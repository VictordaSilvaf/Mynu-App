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

    const handlePlanClick = (planName: string, price_id: string) => {
        if (planName === "free" || !auth.user) {
            router.visit("/login");
            return;
        }

        router.visit(payment.checkout({ plan: planName, billing: isAnnual ? 'annual' : 'monthly', price_id: price_id }));
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
                            price={0}
                            onButtonClick={() => handlePlanClick("free", plans.free.price_id)}
                            roles={auth.roles}
                        />
                    </div>
                    <div className="animate-fade-in [animation-delay:200ms] md:-mt-4 md:mb-4">
                        <PricingCard
                            {...plans.pro}
                            price={isAnnual ? plans.pro.yearlyPrice : plans.pro.monthlyPrice}
                            onButtonClick={() => handlePlanClick("pro", plans.pro.price_id)}
                            roles={auth.roles}
                        />
                    </div>
                    <div className="animate-fade-in [animation-delay:300ms]">
                        <PricingCard
                            {...plans.enterprise}
                            price={isAnnual ? plans.enterprise.yearlyPrice : plans.enterprise.monthlyPrice}
                            onButtonClick={() => handlePlanClick("enterprise", plans.enterprise.price_id)}
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
