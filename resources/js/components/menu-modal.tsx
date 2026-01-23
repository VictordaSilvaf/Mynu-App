import menus from "@/routes/menus";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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

export default function MenuModal() {
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
                <DrawerTrigger asChild>
                    <Button>Adicionar Cardápio</Button>
                </DrawerTrigger>
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