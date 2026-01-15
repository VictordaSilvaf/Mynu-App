import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "subtle";
}

const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-white/70 backdrop-blur-xl border-white/50 shadow-glass",
      strong: "bg-white/85 backdrop-blur-2xl border-white/60 shadow-glass-lg",
      subtle: "bg-white/50 backdrop-blur-md border-white/30 shadow-soft",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "border rounded-2xl p-6 transition-all duration-300",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassPanel.displayName = "GlassPanel";

export { GlassPanel };
