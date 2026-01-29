'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface StatementLine {
    date: string
    reference: string
    type: string
    debit: number
    credit: number
    balance: number
}

interface StatementResponse {
    customer: { name: string }
    openingBalance: number
    closingBalance: number
    lines: StatementLine[]
}

export default function CustomerStatementPage() {
    const params = useParams<{ id: string }>()
    const customerId = params.id

    const [data, setData] = useState<StatementResponse | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Lock current period once
    const [{ year, month }] = useState(() => {
        const now = new Date()
        return {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
        }
    })

    useEffect(() => {
        if (!customerId) return

        fetch(`/api/customers/${customerId}/statement?year=${year}&month=${month}`)
            .then(async (r) => {
                if (!r.ok) throw new Error(await r.text())
                return r.json()
            })
            .then((res: StatementResponse) => {
                // Sort by date ascending
                res.lines.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                setData(res)
            })
            .catch((err) => {
                console.error(err)
                setError('Failed to load customer statement')
            })
    }, [customerId, year, month])

    if (error) {
        return <div className="p-8 text-red-600">{error}</div>
    }

    if (!data) {
        return <div className="p-8">Loading statement…</div>
    }

    return (
        <div className="p-5 space-y-2">
            <div className="mb-2">
                <Link
                    className="inline-flex items-center gap-2 text-sm cursor-pointer font-medium text-zinc-600 hover:text-zinc-900"
                    href="/payments/statements"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Link>
            </div>
            {/* HEADER */}
            <div className='items-center text-center'>
                <h1 className="text-3xl font-bold">Statement Of Account</h1>
                <p className="text-xl">{data.customer.name}</p>
                <p className="text-sm text-gray-500">
                    Period: {month}/{year}
                </p>
            </div>
            <div className="flex justify-end items-center px-2">
                <div className="text-right">
                    <p className="text-sm">Opening Balance</p>
                    <p className="text-xl font-semibold">
                        {data.openingBalance.toFixed(2)}
                    </p>
                </div>
            </div>

            {/* LEDGER */}
            <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left">Date</th>
                            <th className="p-2 text-left">Reference</th>
                            <th className="p-2 text-left">Type</th>
                            <th className="p-2 text-right">Debit</th>
                            <th className="p-2 text-right">Credit</th>
                            <th className="p-2 text-right">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.lines.map((l, i) => (
                            <tr key={i} className="border-t hover:bg-gray-50">
                                <td className="p-2">
                                    {new Date(l.date).toLocaleDateString()}
                                </td>
                                <td className="p-2 font-mono">{l.reference}</td>
                                <td className="p-2">{l.type}</td>
                                <td className="p-2 text-right text-red-600">
                                    {l.debit ? l.debit.toFixed(2) : ''}
                                </td>
                                <td className="p-2 text-right text-green-600">
                                    {l.credit ? l.credit.toFixed(2) : ''}
                                </td>
                                <td className="p-2 text-right font-medium">
                                    {l.balance.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end">
                <div className="text-right">
                    <p className="text-sm">Closing Balance</p>
                    <p className="text-2xl font-bold">
                        {data.closingBalance.toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    )
}
