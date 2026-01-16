import { cn } from "@/lib/utils";

interface PricingToggleProps {
  isAnnual: boolean;
  onToggle: (isAnnual: boolean) => void;
}

export function PricingToggle({ isAnnual, onToggle }: PricingToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-secondary p-1">
      <button
        onClick={() => onToggle(false)}
        className={cn(
          "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
          !isAnnual
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Mensal
      </button>
      
      <button
        onClick={() => onToggle(true)}
        className={cn(
          "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
          isAnnual
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Anual
        <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
          20% OFF
        </span>
      </button>
    </div>
  );
}
