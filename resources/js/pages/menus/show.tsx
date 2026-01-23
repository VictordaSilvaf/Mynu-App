import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Menu as MenuType, type PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, Settings } from 'lucide-react';
import { SectionCard } from '@/components/sections/section-card';
import { SectionModal } from '@/components/sections/section-modal';
import { useState } from 'react';
import menus from '@/routes/menus';

interface ShowMenuProps extends PageProps {
    menu: MenuType;
}

export default function ShowMenu({ menu }: ShowMenuProps) {
    const [sectionModalOpen, setSectionModalOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Menus',
            href: menus.index().url,
        },
        {
            title: menu.name,
            href: menus.show(menu.id).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Menu: ${menu.name}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={menus.index().url}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold">{menu.name}</h1>
                                <Badge variant={menu.is_active ? 'default' : 'secondary'}>
                                    {menu.is_active ? 'Ativo' : 'Inativo'}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Gerencie as seções e pratos do seu cardápio
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon">
                            <Settings className="size-4" />
                        </Button>
                        <Button onClick={() => setSectionModalOpen(true)}>
                            <Plus className="mr-2 size-4" />
                            Nova Seção
                        </Button>
                    </div>
                </div>

                {/* Sections */}
                {menu.sections && menu.sections.length > 0 ? (
                    <div className="grid gap-6">
                        {menu.sections.map((section) => (
                            <SectionCard key={section.id} section={section} menuId={menu.id} />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold">Nenhuma seção criada</h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Comece criando seções para organizar seu cardápio
                                </p>
                                <Button 
                                    className="mt-4"
                                    onClick={() => setSectionModalOpen(true)}
                                >
                                    <Plus className="mr-2 size-4" />
                                    Criar primeira seção
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <SectionModal 
                open={sectionModalOpen}
                onOpenChange={setSectionModalOpen}
                menuId={menu.id}
            />
        </AppLayout>
    );
}
