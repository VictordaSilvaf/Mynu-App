import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';

interface Dish {
    id: number;
    name: string;
    description: string | null;
    price: number;
    promotional_price: number | null;
    image: string | null;
    order: number;
}

interface Section {
    id: number;
    name: string;
    description: string | null;
    order: number;
    dishes: Dish[];
}

interface PublicMenuProps {
    menu: { id: number; name: string };
    store: {
        name: string;
        colors: string[];
        logo_image: string | null;
        background_image: string | null;
    };
    sections: Section[];
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(price);
}

export default function PublicMenu({
    menu,
    store,
    sections,
}: Readonly<PublicMenuProps>) {
    const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

    const c = store.colors ?? [];
    const colorBg = c[0] ?? '#f8fafc';
    const colorGrad1 = c[1] ?? '#e0e7ff';
    const colorGrad2 = c[2] ?? '#c7d2fe';
    const colorTitle = c[3] ?? '#1e293b';
    const colorSubtitle = c[4] ?? '#64748b';
    const colorSection = c[5] ?? '#334155';
    const colorCard = c[6] ?? '#ffffff';
    const colorCardText = c[7] ?? '#0f172a';
    const colorPrice = c[8] ?? '#059669';

    const headerBgStyle = store.background_image
        ? {
            backgroundImage: `linear-gradient(0deg, rgba(255,255,255,0.9) 0%, rgba(248,248,248,0.75) 100%), url(/storage/${store.background_image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }
        : {
            background: `linear-gradient(135deg, ${colorGrad1} 0%, ${colorGrad2} 100%)`,
        };

    return (
        <div
            className="min-h-screen font-['Outfit'] antialiased"
            style={{ backgroundColor: colorBg }}
        >
            <Head title={`${menu.name} - ${store.name}`} />

            {/* Header */}
            <header
                className="relative min-h-[200px] w-full overflow-hidden border-b sm:min-h-[260px] md:min-h-[320px]"
                style={{ ...headerBgStyle, borderColor: `${colorTitle}25` }}
            >
                <div className="absolute inset-0 flex flex-col items-center justify-center px-5 py-10 text-center sm:px-6 sm:py-14 lg:px-8">
                    {store.logo_image && (
                        <div className="mb-4 flex shrink-0 items-center justify-center sm:mb-6">
                            <img
                                src={`/storage/${store.logo_image}`}
                                alt=""
                                className="h-20 w-20 rounded-2xl border-2 border-white/80 object-cover shadow-lg sm:h-24 sm:w-24 md:h-28 md:w-28"
                            />
                        </div>
                    )}
                    <h1
                        className="text-3xl font-bold tracking-tight drop-shadow-sm sm:text-4xl md:text-5xl"
                        style={{ color: colorTitle }}
                    >
                        {store.name}
                    </h1>
                    <p
                        className="mt-2 text-lg font-medium sm:text-xl"
                        style={{ color: colorSubtitle }}
                    >
                        {menu.name}
                    </p>
                </div>
            </header>

            {/* Conteúdo principal */}
            <main className="mx-auto max-w-5xl px-5 py-10 sm:px-6 lg:px-8">
                {sections.map((section) => (
                    <section key={section.id} className="mb-14 last:mb-16">
                        <h2
                            className="mb-2 text-xl font-semibold tracking-tight"
                            style={{ color: colorSection }}
                        >
                            {section.name}
                        </h2>

                        {section.description && (
                            <p
                                className="mb-6 text-sm leading-relaxed"
                                style={{ color: colorSection, opacity: 0.85 }}
                            >
                                {section.description}
                            </p>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
                            {section.dishes.map((dish) => (
                                <button
                                    type="button"
                                    key={dish.id}
                                    onClick={() => setSelectedDish(dish)}
                                    className="group relative flex w-full gap-4 rounded-2xl border text-left shadow-sm transition-all duration-300 hover:shadow-md active:scale-[0.99] cursor-pointer touch-manipulation"
                                    style={{
                                        backgroundColor: colorCard,
                                        borderColor: `${colorCardText}30`,
                                    }}
                                >
                                    {/* Imagem à esquerda */}
                                    {dish.image ? (
                                        <div className="shrink-0 overflow-hidden rounded-xl bg-[hsl(30_20%_92%)] size-24 sm:size-36 md:size-52">
                                            <img
                                                src={`/storage/${dish.image}`}
                                                alt={dish.name}
                                                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className="shrink-0 rounded-xl bg-[hsl(30_20%_92%)] size-24 sm:size-36 md:size-52"
                                            aria-hidden
                                        />
                                    )}

                                    {/* Conteúdo à direita */}
                                    <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                                        <h3
                                            className="truncate font-medium leading-tight text-base sm:text-lg"
                                            style={{ color: colorCardText }}
                                        >
                                            {dish.name}
                                        </h3>
                                        {dish.description && (
                                            <p
                                                className="line-clamp-2 text-sm leading-relaxed"
                                                style={{ color: colorCardText, opacity: 0.85 }}
                                            >
                                                {dish.description}
                                            </p>
                                        )}
                                        <span
                                            className="mt-1 inline-flex w-fit flex-row items-start gap-1.5 rounded-lg px-2.5 py-1 text-sm font-semibold"
                                            style={{
                                                backgroundColor: `${colorPrice}20`,
                                                color: colorPrice,
                                            }}
                                        >
                                            {dish.promotional_price != null && (
                                                <span className="text-[10px] font-normal opacity-70 line-through">
                                                    {formatPrice(dish.price)}
                                                </span>
                                            )}
                                            {formatPrice(dish.promotional_price ?? dish.price)}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                ))}
            </main>

            {/* Footer simples */}
            <footer className="mt-16 border-t py-6" style={{ borderColor: `${colorCardText}30`, backgroundColor: colorCard, color: colorCardText }}>
                <div className="mx-auto max-w-5xl px-5 text-center text-sm sm:px-6 lg:px-8">
                    MYNU • {store.name} • {new Date().getFullYear()}
                </div>
            </footer>

            {/* Modal de detalhes do prato (Drawer mobile-first) */}
            <Drawer
                open={selectedDish !== null}
                onOpenChange={(open) => !open && setSelectedDish(null)}
                direction="bottom"
            >
                <DrawerContent
                    className="max-h-[92dvh] rounded-t-2xl border-t"
                    style={{ backgroundColor: colorCard, borderColor: `${colorCardText}30` }}
                >
                    {selectedDish && (
                        <div className="flex flex-1 flex-col overflow-y-auto">
                            {/* Imagem em destaque */}
                            {selectedDish.image ? (
                                <div className="relative -mx-4 aspect-4/3 max-h-[45vh] shrink-0 overflow-hidden bg-[hsl(30_20%_92%)] sm:-mx-6 sm:rounded-t-2xl">
                                    <img
                                        src={`/storage/${selectedDish.image}`}
                                        alt={selectedDish.name}
                                        className="size-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div
                                    className="-mx-4 h-32 shrink-0 bg-[hsl(30_20%_92%)] sm:-mx-6"
                                    aria-hidden
                                />
                            )}

                            <DrawerHeader className="shrink-0 px-4 pb-2 pt-4 text-left sm:px-6">
                                <DrawerTitle
                                    className="text-xl font-semibold sm:text-2xl"
                                    style={{ color: colorCardText }}
                                >
                                    {selectedDish.name}
                                </DrawerTitle>
                                <DrawerDescription asChild>
                                    <p
                                        className="mt-2 text-base leading-relaxed"
                                        style={{ color: colorCardText, opacity: 0.85 }}
                                    >
                                        {selectedDish.description ||
                                            'Sem descrição.'}
                                    </p>
                                </DrawerDescription>
                                <p
                                    className="mt-3 flex flex-col gap-0.5 text-lg font-bold"
                                    style={{ color: colorPrice }}
                                >
                                    {selectedDish.promotional_price != null && (
                                        <span className="text-base font-normal opacity-75 line-through">
                                            {formatPrice(selectedDish.price)}
                                        </span>
                                    )}
                                    {formatPrice(selectedDish.promotional_price ?? selectedDish.price)}
                                </p>
                            </DrawerHeader>

                            <div className="flex-1 px-4 pb-6 sm:px-6">
                                <DrawerClose asChild>
                                    <button
                                        type="button"
                                        className="w-full rounded-xl border py-3 text-sm font-medium transition-colors hover:opacity-90 active:opacity-80"
                                        style={{
                                            borderColor: `${colorCardText}40`,
                                            backgroundColor: colorBg,
                                            color: colorCardText,
                                        }}
                                    >
                                        Fechar
                                    </button>
                                </DrawerClose>
                            </div>
                        </div>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    );
}
