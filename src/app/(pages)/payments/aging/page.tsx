'use client'

import React, { useEffect, useState } from 'react'

interface Invoice {
    invoiceNumber: string
    saleDate: string
    dueDate: string | null
    total: number
    allocatedPayments: number
    unallocatedPayments: number
    balance: number
    daysOverdue: number
    agingBucket: string
}

interface CustomerReport {
    customerName: string
    totalBalance: number
    buckets: Record<string, number>
    invoices: Invoice[]
}

interface AgingResponse {
    report: CustomerReport[]
    grandTotals: {
        totalBalance: number
        buckets: Record<string, number>
    }
}

export default function AgingReportPage() {
    const [data, setData] = useState<AgingResponse | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [expandedCustomers, setExpandedCustomers] = useState<Record<string, boolean>>({})

    useEffect(() => {
        fetch('/api/reports/aging')
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text())
                return res.json()
            })
            .then(setData)
            .catch((err) => {
                console.error(err)
                setError('Failed to load aging report')
            })
    }, [])

    const toggleExpand = (customerName: string) => {
        setExpandedCustomers((prev) => ({
            ...prev,
            [customerName]: !prev[customerName],
        }))
    }

    if (error) return <div className="p-8 text-red-600">{error}</div>
    if (!data) return <div className="p-8">Loading aging report…</div>

    const agingBuckets = ['Current', '0-30', '31-60', '61-90', '90+']

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-2xl font-bold">Accounts Receivable Aging Report</h1>

            <table className="w-full text-sm border rounded-xl overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 text-left">Customer</th>
                        <th className="p-2 text-right">Total Balance</th>
                        {agingBuckets.map((b) => (
                            <th key={b} className="p-2 text-right">{b}</th>
                        ))}
                        <th className="p-2 text-center">Details</th>
                    </tr>
                </thead>
                <tbody>
                    {data.report.map((c) => (
                        <React.Fragment key={c.customerName}>
                            <tr className="border-t hover:bg-gray-50">
                                <td className="p-2 font-medium">{c.customerName}</td>
                                <td className="p-2 text-right">{c.totalBalance.toFixed(2)}</td>
                                {agingBuckets.map((b) => (
                                    <td key={b} className="p-2 text-right">{c.buckets[b].toFixed(2)}</td>
                                ))}
                                <td className="p-2 text-center">
                                    <button
                                        className="text-blue-600 hover:underline"
                                        onClick={() => toggleExpand(c.customerName)}
                                    >
                                        {expandedCustomers[c.customerName] ? 'Hide' : 'Show'}
                                    </button>
                                </td>
                            </tr>

                            {expandedCustomers[c.customerName] &&
                                c.invoices.map((inv) => (
                                    <tr key={inv.invoiceNumber} className="border-t bg-gray-50">
                                        <td className="p-2 pl-8 font-mono">{inv.invoiceNumber}</td>
                                        <td className="p-2 text-right">{inv.balance.toFixed(2)}</td>
                                        <td className="p-2 text-right">{inv.agingBucket === 'Current' ? inv.balance.toFixed(2) : ''}</td>
                                        <td className="p-2 text-right">{inv.agingBucket === '0-30' ? inv.balance.toFixed(2) : ''}</td>
                                        <td className="p-2 text-right">{inv.agingBucket === '31-60' ? inv.balance.toFixed(2) : ''}</td>
                                        <td className="p-2 text-right">{inv.agingBucket === '61-90' ? inv.balance.toFixed(2) : ''}</td>
                                        <td className="p-2 text-right">{inv.agingBucket === '90+' ? inv.balance.toFixed(2) : ''}</td>
                                        <td className="p-2 text-left">
                                            {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                ))}
                        </React.Fragment>
                    ))}
                </tbody>

                {/* GRAND TOTALS */}
                <tfoot className="bg-gray-200 font-semibold">
                    <tr>
                        <td className="p-2">Grand Total</td>
                        <td className="p-2 text-right">{data.grandTotals.totalBalance.toFixed(2)}</td>
                        {agingBuckets.map((b) => (
                            <td key={b} className="p-2 text-right">{data.grandTotals.buckets[b].toFixed(2)}</td>
                        ))}
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}
