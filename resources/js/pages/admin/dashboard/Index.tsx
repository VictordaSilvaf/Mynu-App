import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem, type DashboardMetricsData } from '@/types';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Legend,
} from 'recharts';
import { index as adminDashboardIndex } from '@/routes/admin/dashboard';


interface DashboardProps {
    metrics: DashboardMetricsData;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: adminDashboardIndex.url,
    },
    {
        title: 'Dashboard',
        href: adminDashboardIndex.url,
    },
];

export default function Dashboard({ metrics }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Global Metrics</h1>

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">
                                {metrics.totalUsers}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Stores</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">
                                {metrics.activeStores}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Menus</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">
                                {metrics.totalMenus}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Subscriptions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">
                                {metrics.activeSubscriptions}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Canceled Subscriptions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">
                                {metrics.canceledSubscriptions}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Expired Subscriptions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">
                                {metrics.expiredSubscriptions}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly User Growth</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={Object.entries(
                                        metrics.monthlyUserGrowth,
                                    ).map(([month, count]) => ({
                                        month,
                                        count,
                                    }))}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Store Growth</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={Object.entries(
                                        metrics.monthlyStoreGrowth,
                                    ).map(([month, count]) => ({
                                        month,
                                        count,
                                    }))}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Menu Growth</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={Object.entries(
                                        metrics.monthlyMenuGrowth,
                                    ).map(([month, count]) => ({
                                        month,
                                        count,
                                    }))}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#ffc658" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Subscription Growth</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={Object.entries(
                                        metrics.monthlySubscriptionGrowth,
                                    ).map(([month, count]) => ({
                                        month,
                                        count,
                                    }))}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#ff7300" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
