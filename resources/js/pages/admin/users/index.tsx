import { AppShell } from '@/components/app-shell'
import { Breadcrumbs } from '@/components/breadcrumbs'
import Heading from '@/components/heading'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { PageProps, User } from '@/types'
import { Head } from '@inertiajs/react'
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import AppLayout from '@/layouts/app-layout'

type UserIndexProps = PageProps & {
    users: {
        data: User[]
    }
}

const crumbs: BreadcrumbItemType[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Users',
        href: '/admin/users',
    },
];

export default function UserIndex({ users }: UserIndexProps) {
    return (
        <AppLayout breadcrumbs={crumbs}>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative flex-1 overflow-hidden rounded-xl md:min-h-min dark:border-sidebar-border">
                    <Head title="Users" />

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        {user.roles?.map((role) => (
                                            <span
                                                key={role.id}
                                                className="mr-2 rounded-full bg-blue-500 px-2 py-1 text-xs text-white"
                                            >
                                                {role.name}
                                            </span>
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        {/* view more details button */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout >
    )
}
