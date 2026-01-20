import { type LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    variant?: 'default' | 'highlight';
}

export function FeatureCard({ icon: Icon, title, description, variant = 'default' }: FeatureCardProps) {
    return (
        <div
            className={`group relative rounded-xl border p-6 transition-all duration-300 hover:shadow-lg ${
                variant === 'highlight'
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:border-primary/50'
            }`}
        >
            <div
                className={`mb-4 inline-flex rounded-lg p-3 ${
                    variant === 'highlight' ? 'bg-primary/10' : 'bg-primary/5 group-hover:bg-primary/10'
                }`}
            >
                <Icon className={`size-6 ${variant === 'highlight' ? 'text-primary' : 'text-primary'}`} />
            </div>

            <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>

            {variant === 'highlight' && (
                <div className="absolute right-4 top-4">
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                        Popular
                    </span>
                </div>
            )}
        </div>
    );
}
