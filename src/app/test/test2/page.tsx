'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Transfer {
    id: string;
    ibtNumber: string;
    fromLocation: { name: string };
    toLocation: { name: string };
    status: string;
}

export default function DispatchTransferPage({
    params,
}: {
    params: { id: string };
}) {
    const [transfer, setTransfer] = useState<Transfer | null>(null);
    const [transporterId, setTransporterId] = useState('');
    const [driverName, setDriverName] = useState('');
    const router = useRouter();

    useEffect(() => {
        async function load() {
            const res = await fetch(`/api/transfers/${params.id}`);
            setTransfer(await res.json());
        }
        load();
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`/api/transfers/${params.id}/dispatch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transporterId, driverName }),
        });

        if (res.ok) router.push('/transfers');
    };

    if (!transfer) {
        return (
            <div className="py-24 text-center text-sm text-zinc-500">
                Loading transfer…
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6 p-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-zinc-900">
                    Dispatch Transfer {transfer.ibtNumber}
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                    {transfer.fromLocation.name} → {transfer.toLocation.name}
                </p>
            </div>

            {/* Summary */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-500">
                            From
                        </p>
                        <p className="mt-1 font-medium text-zinc-900">
                            {transfer.fromLocation.name}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-500">
                            To
                        </p>
                        <p className="mt-1 font-medium text-zinc-900">
                            {transfer.toLocation.name}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-500">
                            Status
                        </p>
                        <span className="mt-1 inline-flex rounded-full border bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                            {transfer.status.replace('_', ' ')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Dispatch Form */}
            <form
                onSubmit={handleSubmit}
                className="rounded-lg border bg-white p-6 shadow-sm space-y-6"
            >
                <h2 className="text-sm font-semibold text-zinc-900">
                    Dispatch Details
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700">
                            Transporter ID
                        </label>
                        <input
                            type="text"
                            value={transporterId}
                            onChange={(e) => setTransporterId(e.target.value)}
                            required
                            className="mt-2 w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter transporter reference"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700">
                            Driver Name
                        </label>
                        <input
                            type="text"
                            value={driverName}
                            onChange={(e) => setDriverName(e.target.value)}
                            required
                            className="mt-2 w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Full driver name"
                        />
                    </div>
                </div>

                {/* Warning */}
                <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    Confirming dispatch will mark this transfer as <strong>in
                        transit</strong>. Ensure transporter and driver details are
                    correct.
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-md border px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Confirm Dispatch
                    </button>
                </div>
            </form>
        </div>
    );
}
