import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, home, menus } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ClipboardList, LayoutGrid, Sparkle } from 'lucide-react';
import AppLogo from './app-logo';
import { index as subscriptionIndex } from '@/routes/subscription';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Meus Cardápios',
        href: menus(),
        icon: ClipboardList,
    },
    {
        title: 'Minha Assinatura',
        href: subscriptionIndex(),
        icon: Sparkle,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'MYNU',
        href: 'https://mynu.com',
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={home()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
