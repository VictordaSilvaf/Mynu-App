import { Button } from "./ui/button";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea"

export default function MenuModal() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = () => {
        // Handle menu creation logic here
        console.log({ name, description });
        setName("");
        setDescription("");
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
                    <div className="px-4 py-4 space-y-4">
                        <div>
                            <label className="text-sm font-medium">Nome do Cardápio</label>
                            <Input
                                placeholder="Digite o nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Descrição</label>
                            <Textarea
                                placeholder="Digite a descrição"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                    <DrawerFooter>
                        <Button onClick={handleSubmit}>Criar Cardápio</Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
}