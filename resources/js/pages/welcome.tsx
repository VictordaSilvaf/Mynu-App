import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import {
    Smartphone,
    Eye,
    Zap,
    Check,
    ArrowRight,
    QrCode,
    Layers,
    Send,
    Menu,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

import risotoImg from "@/assets/images/1.jpeg";
import picanhaImg from "@/assets/images/2.jpeg";
import spaghettiImg from "@/assets/images/3.jpeg";
import Logo from "@/assets/images/logo.png";
import { Link, usePage } from "@inertiajs/react";
import { dashboard, login, register } from "@/routes";
import { SharedData, User } from "@/types";
import { PricingPage } from "@/components/pricing/PricingPage";

const features = [
    { icon: Check, text: "Fácil de usar" },
    { icon: Check, text: "Personalizável" },
    { icon: Check, text: "Rápido" },
    { icon: Check, text: "3D Realista" },
];

const steps = [
    { icon: Layers, title: "Adicione pratos", desc: "Cadastre seus pratos" },
    { icon: QrCode, title: "Personalize", desc: "Customize o layout" },
    { icon: Send, title: "Publique", desc: "Compartilhe o menu" },
];

export default function Landing() {
    const { auth, name } = usePage<SharedData>().props;
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    const phoneY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsSubmitted(true);
            setEmail("");
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-background overflow-x-hidden">
            {/* Mobile-first Navbar */}
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
                    <div className="hidden md:flex items-center gap-6">
                        <a href="#banner" className="text-sm text-muted-foreground transition-colors hover:border-b hover:border-primary hover:text-primary">Início</a>
                        <a href="#how" className="text-sm text-muted-foreground transition-colors hover:border-b hover:border-primary hover:text-primary">Recursos</a>
                        <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:border-b hover:border-primary hover:text-primary">Preços</a>
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
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
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
                            <a href="#features" className="text-sm py-2">Home</a>
                            <a href="#how" className="text-sm py-2">Features</a>
                            <a href="#pricing" className="text-sm py-2">Pricing</a>

                            <Link href={login()} className="w-full bg-primary text-primary-foreground rounded-full">
                                Login
                            </Link>
                            <Link href={register()} className="w-full bg-primary text-primary-foreground rounded-full">
                                Register
                            </Link>
                        </GlassPanel>
                    </motion.div>
                )}
            </motion.nav>

            {/* Hero Section - Mobile First */}
            <section id="banner" className="relative min-h-screen px-4 pt-24 pb-12 flex flex-col lg:flex-row lg:items-center lg:justify-between lg:px-8 xl:px-16 max-w-7xl mx-auto">
                {/* Background Blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute top-1/4 -right-32 w-64 h-64 bg-primary/15 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{ scale: [1.1, 1, 1.1], y: [0, 30, 0] }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute bottom-1/4 -left-32 w-80 h-80 bg-accent/40 rounded-full blur-3xl"
                    />
                </div>

                {/* Left Content */}
                <div className="relative z-10 flex-1 lg:max-w-xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-6"
                    >
                        Crie cardápios digitais impressionantes com{" "}
                        <span className="text-primary">visualização 3D</span> interativa
                    </motion.h1>

                    {/* Feature Checklist */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="grid grid-cols-2 gap-3 mb-8"
                    >
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.text}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="flex items-center gap-2"
                            >
                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                                    <feature.icon className="w-3 h-3 text-primary" />
                                </div>
                                <span className="text-sm text-foreground">{feature.text}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* How it Works Mini */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        id="how"
                        className="mb-8"
                    >
                        <h3 className="text-lg font-semibold mb-4 text-foreground">Como funciona</h3>
                        <div className="flex flex-wrap gap-4">
                            {steps.map((step, i) => (
                                <motion.div
                                    key={step.title}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    className="flex items-center gap-2"
                                >
                                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                                        <step.icon className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-foreground">{step.title}</p>
                                        <p className="text-[10px] text-muted-foreground">{step.desc}</p>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <ArrowRight className="w-3 h-3 text-muted-foreground mx-1 hidden sm:block" />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-3"
                    >
                        <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-base font-medium group">
                            Experimentar Demo
                            <motion.span
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </motion.span>
                        </Button>
                    </motion.div>
                </div>

                {/* Right - Phone Mockup */}
                <motion.div
                    style={{ y: phoneY }}
                    className="relative flex-1 flex justify-center lg:justify-end mt-12 lg:mt-0"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative"
                    >
                        {/* Phone Frame */}
                        <div className="relative w-64 sm:w-72 lg:w-80 aspect-[9/18] bg-foreground rounded-[3rem] p-2 shadow-2xl">
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-foreground rounded-b-xl z-20" />

                            {/* Phone Screen */}
                            <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden relative">
                                {/* Screen Content */}
                                <div className="p-4 pt-8 h-full overflow-hidden">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                                            <ArrowRight className="w-3 h-3 rotate-180 text-muted-foreground" />
                                        </div>
                                        <span className="text-xs font-medium">Dishes</span>
                                        <div className="w-6 h-6" />
                                    </div>

                                    {/* Dish Cards */}
                                    <div className="space-y-3">
                                        <motion.div
                                            animate={{ y: [0, -3, 0] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        >
                                            <GlassPanel className="p-3 !rounded-xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-medium">Grilled Steak</span>
                                                    <span className="text-xs font-semibold text-primary">$14</span>
                                                </div>
                                                <img
                                                    src={picanhaImg}
                                                    alt="Steak"
                                                    className="w-full h-24 object-cover rounded-lg mb-2"
                                                />
                                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                    <Zap className="w-3 h-3 text-primary" />
                                                    <span>In course</span>
                                                </div>
                                            </GlassPanel>
                                        </motion.div>

                                        <motion.div
                                            animate={{ y: [0, -2, 0] }}
                                            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                                        >
                                            <GlassPanel className="p-3 !rounded-xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-medium">Spaghetti Bolognes</span>
                                                    <span className="text-xs font-semibold text-primary">$12</span>
                                                </div>
                                                <img
                                                    src={spaghettiImg}
                                                    alt="Spaghetti"
                                                    className="w-full h-20 object-cover rounded-lg"
                                                />
                                            </GlassPanel>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Glow */}
                        <div className="absolute -inset-8 bg-primary/10 rounded-[4rem] blur-3xl -z-10" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Dashboard Preview Section */}
            <section className="py-16 px-4" id="features">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid lg:grid-cols-2 gap-6"
                    >
                        {/* Dishes Panel */}
                        <GlassPanel className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold">Dishes</h3>
                                <Button size="sm" className="bg-primary text-primary-foreground rounded-full text-xs px-4">
                                    Add dish
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { img: picanhaImg, name: "Grilled Steak", price: "$14", cat: "Medium" },
                                    { img: spaghettiImg, name: "Spaghetti Bolognese", price: "$12", cat: "Main Course" },
                                    { img: risotoImg, name: "Risotto", price: "$10", cat: "Hunger" },
                                ].map((dish, i) => (
                                    <motion.div
                                        key={dish.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="flex items-center gap-4 p-2 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer"
                                    >
                                        <img src={dish.img} alt={dish.name} className="w-14 h-14 rounded-xl object-cover" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{dish.name}</p>
                                            <p className="text-xs text-muted-foreground">{dish.cat}</p>
                                        </div>
                                        <span className="text-sm font-semibold">{dish.price}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button variant="outline" className="flex-1 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground text-sm">
                                    Upload Photo
                                </Button>
                                <Button variant="outline" className="flex-1 rounded-full text-sm">
                                    Generate 3D Model
                                </Button>
                            </div>
                        </GlassPanel>

                        {/* Menu Preview Panel */}
                        <GlassPanel className="p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Eye className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Seder</span>
                                <div className="ml-auto">
                                    <Menu className="w-4 h-4 text-muted-foreground" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { title: "Starters", items: [["Caesar Salad", "$10"], ["Spaghetti Bolognese", "$12"]] },
                                    { title: "Main Course", items: [["Grilled Steak", "$14"], ["Margherita Pizza", "$13"]] },
                                    { title: "Desserts", items: [["Tiramisu", "$8"]] },
                                ].map((section) => (
                                    <div key={section.title}>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-2">{section.title}</h4>
                                        <div className="space-y-2">
                                            {section.items.map(([name, price]) => (
                                                <div key={name} className="flex justify-between text-sm py-1">
                                                    <span>{name}</span>
                                                    <span className="font-medium">{price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button className="w-full mt-6 bg-primary text-primary-foreground rounded-full">
                                Publish Menu
                            </Button>
                        </GlassPanel>
                    </motion.div>
                </div>
            </section>

            <section className="pt-4" id="pricing">
                <PricingPage />
            </section>

            {/* Lead Capture */}
            <section className="py-16 px-4">
                <div className="max-w-xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <GlassPanel className="p-8 text-center relative overflow-hidden">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-16 -right-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl"
                            />

                            <h2 className="text-2xl font-semibold mb-2">Comece gratuitamente</h2>
                            <p className="text-sm text-muted-foreground mb-6">
                                Receba novidades e seja o primeiro a testar
                            </p>

                            {isSubmitted ? (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex items-center justify-center gap-2 text-primary py-4"
                                >
                                    <Check className="w-5 h-5" />
                                    <span className="font-medium">Inscrito com sucesso!</span>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                                    <Input
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex-1 rounded-full px-5 bg-white/50 border-white/60"
                                        required
                                    />
                                    <Button
                                        type="submit"
                                        className="bg-primary text-primary-foreground rounded-full px-8"
                                    >
                                        Inscrever
                                    </Button>
                                </form>
                            )}
                        </GlassPanel>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-border/50">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                            <Smartphone className="w-3 h-3 text-primary-foreground" />
                        </div>
                        <span className="font-medium text-sm">mynu</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        © 2024 mynu. Todos os direitos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
}
