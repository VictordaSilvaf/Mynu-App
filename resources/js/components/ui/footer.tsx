import { about, contact, faq, features, pricing } from "@/routes";
import { Link } from "@inertiajs/react";
import { Smartphone, Instagram, Twitter, Linkedin, Github, Mail } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background border-t border-border/50 pt-16 pb-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Coluna 1: Branding & Sobre */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <Smartphone className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-foreground uppercase">mynu</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Transformando a experiência gastronômica digital. Soluções inteligentes para cardápios e gestão de pedidos.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Coluna 2: Produto */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Produto</h4>
                        <ul className="flex flex-col gap-3">
                            <li><Link href={features()} className="text-sm text-muted-foreground hover:text-primary transition-colors">Recursos</Link></li>
                            <li><Link href={pricing()} className="text-sm text-muted-foreground hover:text-primary transition-colors">Preços</Link></li>
                            <li><Link href={faq()} className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Coluna 3: Empresa */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
                        <ul className="flex flex-col gap-3">
                            <li><Link href={about()} className="text-sm text-muted-foreground hover:text-primary transition-colors">Sobre Nós</Link></li>
                            <li><Link href={contact()} className="text-sm text-muted-foreground hover:text-primary transition-colors">Contato</Link></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacidade</a></li>
                        </ul>
                    </div>

                    {/* Coluna 4: Newsletter/Contato Direto */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Suporte</h4>
                        <div className="flex flex-col gap-3">
                            <a href="mailto:contato@mynu.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                                <Mail className="w-4 h-4" />
                                contato@mynu.com
                            </a>
                            <p className="text-xs text-muted-foreground mt-2 italic">
                                Precisando de ajuda? Nossa equipe está disponível de Seg a Sex, das 9h às 18h.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Linha Inferior: Copyright */}
                <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {currentYear} mynu. Todos os direitos reservados.
                    </p>
                    <div className="flex gap-6">
                        <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">
                            Made with ❤️ for restaurants
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}