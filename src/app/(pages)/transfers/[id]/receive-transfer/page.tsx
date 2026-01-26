'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '@/app/context/UserContext';

interface Transfer {
    id: string;
    ibtNumber: string;
    fromLocation: { name: string };
    toLocation: { name: string };
    status: string;
    items: { product: { id: string; name: string; weightValue: number; packSize: number }; quantity: number }[];
}

export default function ReceiveTransferPage() {
    const user = useUser();
    const currentUser = user;
    const receivedById = user.id;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [transfer, setTransfer] = useState<Transfer | null>(null);
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
        async function load() {
            try {
                const res = await fetch(`/api/transfers/${id}`);
                if (!res.ok) throw new Error('Failed to fetch transfer');
                const data = await res.json();
                console.log(data)
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
        if (isSubmitting) return;
        try {
            setIsSubmitting(true);
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
        } finally {
            setIsSubmitting(false);
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

                <div className='flex flex-rowg gap-2'>
                    <p className='text-gray-500'>Status: </p>
                    <span className="rounded-lg border bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        {transfer.status.replace('_', ' ')}
                    </span>
                </div>
            </div>
            {/* Receiver */}
            <div className='px-5 py-2 rounded-lg border bg-white shadow-sm'>
                <h1 className='mb-2'>Receiver's Details</h1>
                <div className="flex flex-row gap-5 ">
                    <div>
                        <label className="block text-sm font-medium text-gray-500"> Received By Id </label>
                        <input type="text" value={currentUser?.id} disabled className="mt-2 w-full max-w-sm rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500"> Role</label>
                        <input type="text" value={currentUser?.role} disabled className="mt-2 w-full max-w-sm rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500"> Received At</label>
                        <input type="text" value={new Date().toLocaleString()} disabled className="mt-2 w-full max-w-sm rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-100" />
                    </div>
                </div>
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
                                    Product Name
                                </th>
                                <th className="border-b px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-zinc-700">
                                    Dispatched (Qty)
                                </th>
                                <th className="border-b px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-zinc-700">
                                    Received (Qty)
                                </th>
                                <th className="border-b px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-700">
                                    Received (Tons)
                                </th>
                                <th className="border-b px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-zinc-700">
                                    Damaged
                                </th>
                                <th className="border-b px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-zinc-700">
                                    Expired
                                </th>
                                <th className="border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-700">
                                    Comment
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-zinc-50'} hover:bg-blue-50`}>
                                    <td className="border-b px-4 py-3 font-medium text-zinc-900">
                                        {transfer.items[index].product.name}
                                    </td>
                                    <td className="border-b px-4 py-3 text-center">
                                        {transfer.items[index].quantity}
                                    </td>
                                    <td className="border-b px-4 py-3 text-center">
                                        <input type="number" min={0} value={(item as any)['quantityReceived']} onChange={(e) => setItems((prev) => prev.map((p, i) => i === index ? { ...p, ['quantityReceived']: Number(e.target.value) } : p,),)} className="w-20 rounded-md border px-2 py-1 text-center text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                    </td>
                                    <td className="border-b px-4 py-3 text-center">
                                        {((transfer.items[index].product.weightValue) * (transfer.items[index].product.packSize) * (item as any)['quantityReceived'] / 1000).toFixed(2)} MT
                                    </td>
                                    <td className="border-b px-4 py-3 text-center">
                                        <input type="number" min={0} value={(item as any)['quantityDamaged']} onChange={(e) => setItems((prev) => prev.map((p, i) => i === index ? { ...p, ['quantityDamaged']: Number(e.target.value) } : p,),)} className="w-20 rounded-md border px-2 py-1 text-center text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                    </td>
                                    <td className="border-b px-4 py-3 text-center">
                                        <input type="number" min={0} value={(item as any)['quantityExpired']} onChange={(e) => setItems((prev) => prev.map((p, i) => i === index ? { ...p, ['quantityExpired']: Number(e.target.value) } : p,),)} className="w-20 rounded-md border px-2 py-1 text-center text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                    </td>


                                    <td className="border-b px-4 py-3">
                                        <input type="text" value={item.comment} onChange={(e) => setItems((prev) => prev.map((p, i) => i === index ? { ...p, comment: e.target.value } : p,),)} className="w-full rounded-md border px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Optional" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Warning */}
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Confirming receipt will mark this transfer as <strong>received and cannot be undone</strong>. Ensure product details, quantites, transporter and driver details are correct.
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-md border px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 curosr-pointer"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`rounded-md px-5 py-2 text-sm font-medium text-white cursor-pointer
                        ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                    Confirm Receipt
                </button>
            </div>
            <Toaster position="bottom-left" />
        </div>
    );
}