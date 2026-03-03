import { ReactNode } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import EmptyListAnimation from '@/assets/animations/empty_ghost.lottie';
import { Button } from '@/components/ui/button';

type EmptyStateProps = {
    children: ReactNode;
};

function Root({ children }: EmptyStateProps) {
    return (
        <div className="col-span-full text-center py-12 text-muted-foreground">
            {children}
        </div>
    );
}

function Animation({ src = EmptyListAnimation }: Readonly<{ src?: string }>) {
    return (
        <DotLottieReact
            src={src}
            loop
            autoplay
            className="max-w-xl h-auto mx-auto"
        />
    );
}

function Title({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <h3 className="text-2xl font-bold">{children}</h3>
    );
}

function Description({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <p className="text-muted-foreground">{children}</p>
    );
}

function Action({ children, onClick }: Readonly<{ children: ReactNode, onClick: () => void }>) {
    return (
        <Button variant='outline' className='mt-4' onClick={onClick}>
            {children}
        </Button>
    );
}

export const EmptyState = {
    Root,
    Animation,
    Title,
    Description,
    Action,
};
