import { motion, useScroll, useTransform } from "motion/react";
import { GlassPanel } from "./GlassPanel";
import Logo from "@/assets/images/logo.png";
import { Link, usePage } from "@inertiajs/react";
import { SharedData } from "@/types";
import { dashboard, login, register } from "@/routes";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";
import { MenuMobile } from "../menu-mobile";
import {
    X,
    Menu as MenuIcon,
} from "lucide-react";


export default function Menu() {
    const { auth, name } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { url } = usePage();
    const isActive = (path: string) => url === path || url.startsWith(`${path}/`);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
        >
            <GlassPanel className="px-4 py-2.5 flex items-center justify-between !rounded-full max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-lg">
                        <img src={Logo} alt="mynu logo" className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <span className="font-semibold text-lg text-foreground uppercase">{name}</span>
                </div>

                {/* Desktop Nav */}
                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    {[
                        { name: 'Início', href: '/' },
                        { name: 'Recursos', href: '/features' },
                        { name: 'Preços', href: '/pricing' },
                        { name: 'Sobre', href: '/about' },
                        { name: 'FAQ', href: '/faq' },
                        { name: 'Contato', href: '/contact' },
                    ].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm transition-colors hover:text-primary ${isActive(link.href)
                                ? "text-primary border-primary! font-semibold border-b-2"
                                : "text-muted-foreground"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden md:flex gap-3">
                    {auth.user ? (
                        <Link href={dashboard()} className="bg-primary flex justify-center items-center hover:bg-primary/90 text-primary-foreground rounded-full px-6 text-sm font-medium">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href={login()} className="bg-primary flex justify-center items-center hover:bg-primary/60 text-primary-foreground rounded-full px-6 text-sm font-medium duration-300">
                                Login
                            </Link>
                            <Link href={register()} className="border !border-primary flex justify-center items-center hover:bg-primary/20 text-primary rounded-full px-6 text-sm font-medium duration-300">
                                Register
                            </Link>
                        </>
                    )}

                    {/* Theme Toggle + Mobile Menu */}
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <button
                            className="md:hidden p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="flex md:hidden gap-3">
                    <ThemeToggle />
                    <MenuMobile user={auth.user} isActive={isActive} />{/* Menu content can go here if needed */}
                </div>
            </GlassPanel>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden mt-2"
                >
                    <GlassPanel className="p-4 flex flex-col gap-3">
                        <a href="/" className="text-sm py-2">Início</a>
                        <a href="/features" className="text-sm py-2">Recursos</a>
                        <a href="/pricing" className="text-sm py-2">Preços</a>
                        <a href="/about" className="text-sm py-2">Sobre</a>
                        <a href="/faq" className="text-sm py-2">FAQ</a>
                        <a href="/contact" className="text-sm py-2">Contato</a>

                        {auth.user ? (
                            <Link href={dashboard()} className="w-full bg-primary text-primary-foreground rounded-full">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={login()} className="w-full bg-primary text-primary-foreground rounded-full">
                                    Login
                                </Link>
                                <Link href={register()} className="w-full bg-primary text-primary-foreground rounded-full">
                                    Register
                                </Link>
                            </>
                        )}
                    </GlassPanel>
                </motion.div>
            )}
        </motion.nav>
    );
}