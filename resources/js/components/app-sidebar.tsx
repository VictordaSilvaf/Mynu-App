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
import { dashboard, home } from '@/routes';
import { type NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ClipboardList, HouseIcon, LayoutGrid, Sparkle, Users } from 'lucide-react';
import AppLogo from './app-logo';
import { index as subscriptionIndex } from '@/routes/subscription';
import { index as userIndex } from '@/routes/admin/admin/users';
import { index as menusIndex} from '@/routes/menus';
import { index as storeIndex} from '@/routes/stores';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Minha Loja',
        href: storeIndex(),
        icon: HouseIcon,
    },
    {
        title: 'Meus Cardápios',
        href: menusIndex(),
        icon: ClipboardList,
    },
    {
        title: 'Minha Assinatura',
        href: subscriptionIndex(),
        icon: Sparkle,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'User Management',
        href: userIndex(),
        icon: Users,
    },
]

const footerNavItems: NavItem[] = [
    {
        title: 'MYNU',
        href: home(),
        icon: HouseIcon,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props
    const userRoles = auth.user.roles?.map(role => role.name) || []

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
                {userRoles.includes('admin') && <NavMain items={adminNavItems} title="Administração" />}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
