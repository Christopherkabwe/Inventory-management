'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

interface Transfer {
    id: string;
    ibtNumber: string;
    fromLocation: { name: string };
    toLocation: { name: string };
    status: string;
    items: { product: { id: string; name: string }; quantity: number }[];
}

export default function ReceiveTransferPage() {
    const [currentUser, setCurrentUser] = useState(null);
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [transfer, setTransfer] = useState<Transfer | null>(null);
    const [receivedById, setReceivedById] = useState('');
    const [items, setItems] = useState<
        {
            productId: string;
            quantityReceived: number;
            quantityDamaged: number;
            quantityExpired: number;
            comment: string;
        }[]
    >([]);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const response = await fetch('/api/users/me');
            const data = await response.json();
            setCurrentUser(data.user);
            setReceivedById(data.user.id);
        };
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/transfers/${id}`);
                if (!res.ok) throw new Error('Failed to fetch transfer');
                const data = await res.json();
                setTransfer(data);
                setItems(
                    data.items.map((item: any) => ({
                        productId: item.product.id,
                        quantityReceived: item.quantity,
                        quantityDamaged: 0,
                        quantityExpired: 0,
                        comment: '',
                    })),
                );
            } catch (error) {
                toast.error('Error loading transfer');
                console.error(error);
            }
        }
        load();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !currentUser.id) {
            toast.error('User not loaded');
            return;
        }
        try {
            const res = await fetch(`/api/transfers/${id}/receive`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ receivedById, items }),
            });

            if (res.ok) {
                toast.success('Transfer received successfully');
                router.push('/transfers');
            } else {
                const errorData = await res.json();
                toast.error(errorData.message || 'Error receiving transfer');
            }
        } catch (error) {
            toast.error('Error receiving transfer');
            console.error(error);
        }
    };

    if (!transfer) {
        return (
            <div className="py-24 text-center text-sm text-zinc-500">
                Loading transfer…
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-900">
                        Receive Transfer {transfer.ibtNumber}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        {transfer.fromLocation.name} → {transfer.toLocation.name}
                    </p>
                </div>
                <span className="rounded-full border bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {transfer.status.replace('_', ' ')}
                </span>
            </div>
            {/* Receiver */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
                <label className="block text-sm font-medium text-black">
                    Received By
                </label>
                <input
                    type="text"
                    value={currentUser?.id || ''}
                    disabled
                    className="mt-2 w-full max-w-sm rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-100"
                />
            </div>
            {/* Items Table */}
            <div className="rounded-lg border bg-white shadow-sm">
                <div className="border-b px-6 py-4">
                    <h2 className="text-sm font-semibold text-zinc-900">
                        Received Quantities
                    </h2>
                    <p className="mt-1 text-xs text-zinc-500">
                        Record received, damaged, and expired quantities per product
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-0 text-sm">
                        <thead className="bg-zinc-100">
                            <tr>
                                <th className="border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-700">
                                    Product
                                </th>
                                <th className="border-b px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-700">
                                    Received
                                </th>
                                <th className="border-b px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-700">
                                    Damaged
                                </th>
                                <th className="border-b px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-700">
                                    Expired
                                </th>
                                <th className="border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-700">
                                    Comment
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-zinc-50'} hover:bg-blue-50`}
                                >
                                    <td className="border-b px-4 py-3 font-medium text-zinc-900">
                                        {transfer.items[index].product.name}
                                    </td>
                                    {['quantityReceived', 'quantityDamaged', 'quantityExpired'].map(
                                        (field) => (
                                            <td key={field} className="border-b px-4 py-3 text-right">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={(item as any)[field]}
                                                    onChange={(e) =>
                                                        setItems((prev) =>
                                                            prev.map((p, i) =>
                                                                i === index
                                                                    ? { ...p, [field]: Number(e.target.value) }
                                                                    : p,
                                                            ),
                                                        )
                                                    }
                                                    className="w-20 rounded-md border px-2 py-1 text-right text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                            </td>
                                        ),
                                    )}
                                    <td className="border-b px-4 py-3">
                                        <input
                                            type="text"
                                            value={item.comment}
                                            onChange={(e) =>
                                                setItems((prev) =>
                                                    prev.map((p, i) =>
                                                        i === index ? { ...p, comment: e.target.value } : p,
                                                    ),
                                                )
                                            }
                                            className="w-full rounded-md border px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Optional"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
                    onClick={handleSubmit}
                    className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Confirm Receipt
                </button>
            </div>
            <Toaster position="bottom-left" />
        </div>
    );
}