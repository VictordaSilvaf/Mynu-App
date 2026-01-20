interface StatItem {
    value: string;
    label: string;
}

interface StatsSectionProps {
    title?: string;
    stats: StatItem[];
}

export function StatsSection({ title, stats }: StatsSectionProps) {
    return (
        <section className="border-y border-border bg-muted/30 py-16 max-w-7xl mx-auto">
            <div className="container mx-auto px-4">
                {title && (
                    <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground">{title}</h2>
                )}

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="mb-2 text-4xl font-bold text-primary md:text-5xl">{stat.value}</div>
                            <div className="text-sm text-muted-foreground md:text-base">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
