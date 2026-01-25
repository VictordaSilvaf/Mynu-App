import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { DashboardMetricsData, type BreadcrumbItem, type PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({ metrics, period }: {
    metrics: DashboardMetricsData;
    period: string;
}) {
    const handlePeriodChange = (value: string) => {
        router.get(
            dashboard().url,
            { period: value },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-end">
                    <Select
                        value={period}
                        onValueChange={handlePeriodChange}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Selecione o período" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">Últimos 7 dias</SelectItem>
                            <SelectItem value="30">Últimos 30 dias</SelectItem>
                            <SelectItem value="90">Últimos 90 dias</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total de Acessos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">
                                {metrics.totalAccess}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Produtos Ativos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">
                                {metrics.activeProducts}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Cardápios Criados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">
                                {metrics.createdMenus}
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Última Atualização</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg">
                                {metrics.lastUpdate
                                    ? new Date(
                                          metrics.lastUpdate,
                                      ).toLocaleDateString()
                                    : 'Nenhuma atualização'}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Produtos Mais Acessados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={metrics.mostAccessedProducts?.map(
                                        (p: any) => ({
                                            name: p.dish.name,
                                            total: p.total,
                                        }),
                                    )}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="total" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
