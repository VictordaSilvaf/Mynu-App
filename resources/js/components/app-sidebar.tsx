import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, home, logout } from '@/routes';
import { type NavItem, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { ClipboardList, HouseIcon, LayoutGrid, LogOutIcon, SettingsIcon, Sparkle, Users } from 'lucide-react';
import AppLogo from './app-logo';
import { index as subscriptionIndex } from '@/routes/subscription';
import { index as menusIndex } from '@/routes/menus';
import { index as storeIndex } from '@/routes/stores';
import { index as userIndex } from '@/routes/users';
import profile from '@/routes/profile';
import { Button } from './ui/button';
import { Icon } from './icon';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';

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
        title: 'Configurações',
        href: profile.edit(),
        icon: SettingsIcon,
    },
    {
        title: 'Sair',
        href: logout(),
        icon: LogOutIcon,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props
    const userRoles = auth.user.roles?.map(role => role.name) || []
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

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
                <NavMain items={mainNavItems} title="Plataforma" />
                {userRoles.includes('admin') && <NavMain items={adminNavItems} title="Administração" />}
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <SidebarGroup
                    className={`group-data-[collapsible=icon]:p-0`}
                >
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuButton
                                asChild
                                className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
                            >
                                <a
                                    href={profile.edit().url}
                                    rel="noopener noreferrer"
                                >
                                    <Icon
                                        iconNode={SettingsIcon}
                                        className="h-5 w-5"
                                    />
                                    <span>Configurações</span>
                                </a>
                            </SidebarMenuButton>
                            <SidebarMenuButton
                                asChild
                                className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
                            >
                                <Link
                                    className="block w-full"
                                    href={logout()}
                                    as="button"
                                    onClick={handleLogout}
                                    data-test="logout-button"
                                >
                                    <LogOutIcon className="mr-2" />
                                    Sair
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {/* <NavUser /> */}
            </SidebarFooter>
        </Sidebar>
    );
}
