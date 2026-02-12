'use client'

import { ColumnDef } from '@tanstack/react-table'

interface Subscription {
    id: number;
    plan_name: string;
    next_billing_date: string | null;
}

export const columns: ColumnDef<Subscription>[] = [
    {
        accessorKey: 'plan_name',
        header: 'Plano',
        cell: ({ getValue }) => {
            const value = getValue<string>();

            return <span className="font-medium">{value || '—'}</span>;
        },
    },
    {
        accessorKey: 'next_billing_date',
        header: 'Próxima Data de Cobrança',
        cell: ({ getValue }) => {
            const value = getValue<string | null>();

            if (!value) {
                return '—';
            }

            return new Date(value).toLocaleDateString('pt-BR');
        },
    },
]

