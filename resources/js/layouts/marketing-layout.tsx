import Footer from '@/components/ui/footer';
import Menu from '@/components/ui/menu';
import { ReactNode } from 'react';

interface MarketingLayoutProps {
    children: ReactNode;
}

const navItems = [
    { label: 'Início', href: '/' },
    { label: 'Recursos', href: '/features' },
    { label: 'Preços', href: '/pricing' },
    { label: 'Sobre', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contato', href: '/contact' },
];

export default function MarketingLayout({ children }: MarketingLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <Menu />

            {/* Main Content */}
            <main className="pt-20">{children}</main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
