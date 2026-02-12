'use client'

import { ColumnDef } from '@tanstack/react-table'

interface Subscription {
    id: number;
    plan_name: string;
    next_billing_date: string;
}

export const columns: ColumnDef<Subscription>[] = [
    {
        accessorKey: 'plan_name',
        header: 'Plano',
    },
    {
        accessorKey: 'next_billing_date',
        header: 'Próxima Data de Cobrança',
    },
]

