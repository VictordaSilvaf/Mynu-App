import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
    title: string;
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
}

export function CTASection({ title, subtitle, primaryCta, secondaryCta }: CTASectionProps) {
    return (
        <section className="border-y border-border bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 py-20">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h2>
                    <p className="mb-8 text-lg text-muted-foreground">{subtitle}</p>

                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Button size="lg" onClick={primaryCta.onClick} asChild={!!primaryCta.href} className="group">
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
                            <Button variant="outline" size="lg" onClick={secondaryCta.onClick} asChild={!!secondaryCta.href}>
                                {secondaryCta.href ? (
                                    <a href={secondaryCta.href}>{secondaryCta.text}</a>
                                ) : (
                                    secondaryCta.text
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
