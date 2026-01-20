import { Quote, Star } from 'lucide-react';

interface TestimonialCardProps {
    quote: string;
    author: string;
    role: string;
    company?: string;
    avatar?: string;
    rating?: number;
}

export function TestimonialCard({ quote, author, role, company, avatar, rating = 5 }: TestimonialCardProps) {
    return (
        <div className="relative rounded-xl border border-border bg-card p-6 shadow-sm">
            <Quote className="absolute right-6 top-6 size-8 text-primary/10" />

            {rating && (
                <div className="mb-4 flex gap-1">
                    {Array.from({ length: rating }).map((_, i) => (
                        <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                    ))}
                </div>
            )}

            <p className="mb-6 text-muted-foreground">{quote}</p>

            <div className="flex items-center gap-3">
                {avatar ? (
                    <img src={avatar} alt={author} className="size-12 rounded-full border-2 border-border" />
                ) : (
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                        {author.charAt(0)}
                    </div>
                )}

                <div>
                    <div className="font-semibold text-foreground">{author}</div>
                    <div className="text-sm text-muted-foreground">
                        {role}
                        {company && ` • ${company}`}
                    </div>
                </div>
            </div>
        </div>
    );
}
