import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PricingFeature } from "./PricingFeature";
import { Zap } from "lucide-react";
import { Plan } from "@/types";

export function PricingCard({
  name,
  description = "",
  price,
  priceNote,
  features,
  buttonText,
  isPopular = false,
  roles,
  onButtonClick,
}: Plan & { onButtonClick: () => void } & { price: number } & { roles?: string[] }) {
  const isCurrentPlan = roles?.includes(name.toLowerCase());
  const normalizedFeatures = features.map((feature) =>
    typeof feature === "string" ? { text: feature, icon: "check" as const } : feature
  );

  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-lg",
        isPopular
          ? "border-primary shadow-lg shadow-primary/10"
          : "border-border hover:border-primary/30"
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="whitespace-nowrap rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-md">
            Mais Recomendado!
          </span>
        </div>
      )}

      <div className="mb-5">
        <div className="flex items-center gap-2">
          {isPopular && <Zap className="h-5 w-5 text-primary" />}
          <h3 className="text-xl font-bold text-foreground">{name}</h3>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-foreground">
            R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          {priceNote && (
            <span className="text-sm text-muted-foreground">{priceNote}</span>
          )}
        </div>
      </div>

      {isCurrentPlan ? (
        <Button
          disabled
          className="mb-6 w-full bg-secondary text-muted-foreground"
        >
          Seu plano atual
        </Button>
      ) : (
        <Button
          onClick={onButtonClick}
          className={cn(
            "mb-6 w-full py-5 text-sm font-semibold transition-all duration-300 cursor-pointer",
            isPopular
              ? "bg-primary text-primary-foreground hover:bg-primary/75 shadow-md shadow-primary/20"
              : "bg-primary text-primary-foreground hover:bg-primary/75"
          )}
        >
          {buttonText}
        </Button>
      )}

      <div className="mb-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {name === "Free" ? "Inclui:" : `Inclui tudo do ${name === "Pro" ? "Free" : "Pro"}, mais:`}
        </p>
      </div>

      <ul className="flex-1 space-y-3">
        {normalizedFeatures.map((feature, index) => (
          <PricingFeature key={index} icon={feature.icon}>
            {feature.text}
          </PricingFeature>
        ))}
      </ul>
    </div>
  );
}
