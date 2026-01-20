import { Button } from '@/components/ui/button';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';

interface HeroSectionProps {
    badge?: string;
    title: string | ReactNode;
    subtitle: string;
    primaryCta: {
        text: string;
        href?: string;
        onClick?: () => void;
    };
    secondaryCta?: {
        text: string;
        href?: string;
        onClick?: () => void;
    };
    image?: string;
    Icon?: LucideIcon;
}

export function HeroSection({ badge, title, subtitle, primaryCta, secondaryCta, image, Icon }: HeroSectionProps) {
    return (
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-background to-muted/20 py-5 md:py-16 max-w-7xl mx-auto">
            <div className="container mx-auto px-4">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div className="space-y-8">
                        {badge && (
                            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm">
                                {Icon && <Icon className="size-4" />}
                                <span>{badge}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                                {title}
                            </h1>
                            <p className="text-lg text-muted-foreground md:text-xl">{subtitle}</p>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Button
                                size="lg"
                                onClick={primaryCta.onClick}
                                asChild={!!primaryCta.href}
                                className="group"
                            >
                                {primaryCta.href ? (
                                    <a href={primaryCta.href}>
                                        {primaryCta.text}
                                        <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                                    </a>
                                ) : (
                                    <>
                                        {primaryCta.text}
                                        <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </Button>

                            {secondaryCta && (
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={secondaryCta.onClick}
                                    asChild={!!secondaryCta.href}
                                >
                                    {secondaryCta.href ? (
                                        <a href={secondaryCta.href}>{secondaryCta.text}</a>
                                    ) : (
                                        secondaryCta.text
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>

                    {image && (
                        <div className="relative">
                            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted shadow-2xl">
                                <img src={image} alt={typeof title === 'string' ? title : 'Hero'} className="size-full object-cover" />
                            </div>
                            <div className="absolute -bottom-4 -right-4 -z-10 size-full rounded-2xl bg-primary/10" />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
