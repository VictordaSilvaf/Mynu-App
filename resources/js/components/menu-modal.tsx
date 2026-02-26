import menus from "@/routes/menus";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { useForm } from "@inertiajs/react";

interface MenuModalProps {
    storeComplete?: boolean;
}

export default function MenuModal({ storeComplete = true }: MenuModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(menus.store().url, {
            onSuccess: () => reset(),
        });
    };

    return (
        <div>
            <Drawer direction="right">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="inline-flex">
                            <DrawerTrigger asChild>
                                <Button disabled={!storeComplete}>Adicionar Cardápio</Button>
                            </DrawerTrigger>
                        </span>
                    </TooltipTrigger>
                    {!storeComplete && (
                        <TooltipContent>
                            <p>Complete os dados da loja antes de criar um cardápio.</p>
                            <p className="mt-1 text-muted-foreground text-[10px]">Nome, ao menos um telefone e uma cor.</p>
                        </TooltipContent>
                    )}
                </Tooltip>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Criar Novo Cardápio</DrawerTitle>
                        <DrawerDescription>Preencha os detalhes do novo cardápio</DrawerDescription>
                    </DrawerHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="px-4 py-4 space-y-4">
                            <div>
                                <label className="text-sm font-medium">Nome do Cardápio</label>
                                <Input
                                    placeholder="Digite o nome"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                            </div>
                        </div>
                        <DrawerFooter>
                            <Button type="submit" disabled={processing}>Criar Cardápio</Button>
                            <DrawerClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>
        </div>
    );
}