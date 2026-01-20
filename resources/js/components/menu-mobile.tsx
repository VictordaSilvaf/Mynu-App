import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "./ui/button"
import { Link, usePage } from "@inertiajs/react"
import { Menu, X } from "lucide-react"
import { SharedData, User } from "@/types"
import { dashboard, login, register } from "@/routes"
import Logo from "@/assets/images/logo.png";
import { DialogTitle } from "@radix-ui/react-dialog"

export function MenuMobile({ user, isActive }: { user: User | null, isActive: (path: string) => boolean }) {
    const { name } = usePage<SharedData>().props;
    const menuItems = [
        { name: 'Início', href: '/' },
        { name: 'Recursos', href: '/features' },
        { name: 'Preços', href: '/pricing' },
        { name: 'Sobre', href: '/about' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Contato', href: '/contact' },
    ]

    return (
        <Drawer direction="right">
            <DrawerTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="w-64" aria-describedby={undefined}>
                <DrawerHeader>
                    <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-lg">
                            <img src={Logo} alt="mynu logo" className="w-full h-full object-cover rounded-lg" />
                        </div>
                        <DialogTitle className="font-semibold text-lg text-foreground uppercase">{name}</DialogTitle>
                    </div>
                    <DrawerClose asChild>
                        <Button variant="ghost" size="icon" className="absolute right-4 top-4">
                            <X className="h-5 w-5" />
                        </Button>
                    </DrawerClose>
                </DrawerHeader>
                <nav className="flex flex-col gap-2 px-4 pb-6">
                    {menuItems.map((item) => (
                        <DrawerClose key={item.href} asChild>
                            <a
                                href={item.href}
                                className={`block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isActive(item.href)
                                    ? "text-primary font-semibold"
                                    : "text-muted-foreground"}`}
                            >
                                {item.name}
                            </a>
                        </DrawerClose>
                    ))}

                    <div className="mt-6 gap-3 flex flex-col">
                        {user ? (
                            <Link href={dashboard()} className="bg-primary flex justify-center items-center hover:bg-primary/90 text-primary-foreground rounded-full py-3 px-6 text-sm font-medium">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={login()} className="bg-primary flex justify-center items-center hover:bg-primary/60 text-primary-foreground rounded-full py-3 px-6 text-sm font-medium duration-300">
                                    Login
                                </Link>
                                <Link href={register()} className="border !border-primary flex justify-center items-center hover:bg-primary/20 text-primary rounded-full py-3 px-6 text-sm font-medium duration-300">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </DrawerContent>
        </Drawer>
    )
}