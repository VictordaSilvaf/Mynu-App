import { columns } from '@/components/users-table-columns'
import { UsersTable } from '@/components/users-table'
import { PageProps, User } from '@/types'
import { Head } from '@inertiajs/react'
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types'
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
]

export default function UserIndex({ users }: UserIndexProps) {
    return (
        <AppLayout breadcrumbs={crumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <UsersTable columns={columns} data={users.data} />
            </div>
        </AppLayout>
    )
}
