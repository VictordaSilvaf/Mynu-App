import { Check, Sparkles, BarChart3, Users, Headphones, Layers, QrCode, Image, Palette } from "lucide-react";

interface PricingFeatureProps {
  children: React.ReactNode;
  icon?: "check" | "sparkles" | "chart" | "users" | "headphones" | "layers" | "qr" | "image" | "palette";
}

const iconMap = {
  check: Check,
  sparkles: Sparkles,
  chart: BarChart3,
  users: Users,
  headphones: Headphones,
  layers: Layers,
  qr: QrCode,
  image: Image,
  palette: Palette,
};

export function PricingFeature({ children, icon = "check" }: PricingFeatureProps) {
  const IconComponent = iconMap[icon];
  
  return (
    <li className="flex items-start gap-3">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <IconComponent className="h-3 w-3 text-primary" />
      </div>
      <span className="text-sm text-muted-foreground">{children}</span>
    </li>
  );
}
