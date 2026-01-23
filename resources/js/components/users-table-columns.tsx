'use client'

import { ColumnDef } from '@tanstack/react-table'
import { User } from '@/types'

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'roles',
        header: 'Roles',
        cell: ({ row }) => {
            const user = row.original
            return (
                <div>
                    {user.roles?.map((role) => (
                        <span
                            key={role.id}
                            className="mr-2 rounded-full bg-blue-500 px-2 py-1 text-xs text-white"
                        >
                            {role.name}
                        </span>
                    ))}
                </div>
            )
        }
    },
]
