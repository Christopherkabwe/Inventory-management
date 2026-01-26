// app/transfers/[id]/dispatch/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { ArrowLeft } from 'lucide-react';

interface Transfer {
    id: string;
    ibtNumber: string;
    fromLocation: { name: string };
    toLocation: { name: string };
    status: string;
    transporter?: {
        id: string;
        name: string;
        vehicleNumber: string;
        driverName: string;
        driverPhoneNumber: string;
    };
    items: {
        product: {
            name: string;
            sku: string;
            category: string;
            packSize: number;
            weightValue: number;
            weightUnit: string;
        };
        quantity: number;
    }[];
}

interface Transporter {
    id: string;
    name: string;
    vehicleNumber: string;
    driverName: string;
    driverPhoneNumber: string;
}

const DispatchTransferPage = () => {

    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const [transfer, setTransfer] = useState<Transfer | null>(null);
    const [transporterId, setTransporterId] = useState('');
    const [transporters, setTransporters] = useState<Transporter[]>([]);
    const [selectedTransporter, setSelectedTransporter] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [driverName, setDriverName] = useState('');
    const [driverPhoneNumber, setDriverPhoneNumber] = useState('');


    useEffect(() => {
        const fetchTransfer = async () => {
            const response = await fetch(`/api/transfers/${id}`);
            const data = await response.json();
            setTransfer(data);
            if (data.transporter) {
                setTransporterId(data.transporter.id);
                setSelectedTransporter(data.transporter.id);
                setVehicleNumber(data.transporter.vehicleNumber);
                setDriverName(data.transporter.driverName);
                setDriverPhoneNumber(data.transporter.driverPhoneNumber);
            }
        };
        fetchTransfer();
    }, [id]);

    const handleVehicleNumberChange = (e) => {
        const selectedVehicleNumber = e.target.value;
        setVehicleNumber(selectedVehicleNumber);
        const selectedTransporter = transporters.find((transporter) => transporter.vehicleNumber === selectedVehicleNumber);
        if (selectedTransporter) {
            setTransporterId(selectedTransporter.id);
            setSelectedTransporter(selectedTransporter.id);
            setDriverName(selectedTransporter.driverName);
            setDriverPhoneNumber(selectedTransporter.driverPhoneNumber);
        }
    };


    // Handle Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/transfers/${id}/dispatch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transporterId,
                    driverName,
                    driverPhoneNumber,
                }),
            });

            if (response.ok) {
                toast.success('Transfer dispatched successfully');
                router.push('/transfers');
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Error dispatching transfer');
            }
        } catch (error) {
            toast.error('Error dispatching transfer');
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

    // Total Qty & Tonnage

    const totalQuantity = transfer.items.reduce((acc, item) => acc + item.quantity, 0);
    const totalTonnage = transfer.items.reduce((acc, item) => acc + (item.product.weightValue * item.quantity / 1000), 0).toFixed(2);

    return (
        <div>
            <div className="max-w-6xl p-5 space-y-2">
                <div className="mb-2">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to transfers
                    </button>
                </div>
                <div className='bg-white p-5 rounded-sm hover:shadow-lg'>
                    <a> </a>
                    <div className='flex flex-col w-full items-center'>
                        <h1 className="text-3xl font-semibold text-zinc-900 mb-3">
                            DISPATCH TRANSFER
                        </h1>
                        <span className='mb-5'>IBT Number: {transfer.ibtNumber}</span>
                    </div>
                    <hr className="w-full border-t border-black mb-5" />
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className='flex flex-row gap-5'>
                            <div className='w-full'>
                                <label className="block text-sm font-medium text-zinc-700">Transporter</label>
                                <select value={selectedTransporter} onChange={(e) => setSelectedTransporter(e.target.value)} className="mt-2 w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" >
                                    <option value="">Select Transporter</option>
                                    {transfer.transporter && (
                                        <option key={transfer.transporter.id} value={transfer.transporter.id}>
                                            {transfer.transporter.name}
                                        </option>
                                    )}
                                </select>
                            </div>
                            <div className='w-full'>
                                <label className="block text-sm font-medium text-zinc-700">Vehicle No.</label>
                                <select value={vehicleNumber} onChange={handleVehicleNumberChange} className="mt-2 w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" >
                                    <option value="">Select Vehicle Number</option>
                                    {transfer.transporter && (
                                        <option key={transfer.transporter.id} value={transfer.transporter.vehicleNumber}>
                                            {transfer.transporter.vehicleNumber}
                                        </option>
                                    )}
                                </select>
                            </div>
                            <div className='w-full'>
                                <label className="block text-sm font-medium text-zinc-700">
                                    Driver's Name
                                </label>
                                <input
                                    type="text"
                                    value={driverName}
                                    onChange={(e) => setDriverName(e.target.value)}
                                    className="mt-2 w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div className='w-full'>
                                <label className="block text-sm font-medium text-zinc-700">
                                    Driver's Phone Number
                                </label>
                                <input
                                    type="text"
                                    value={driverPhoneNumber || "+260971234"}
                                    onChange={(e) => setDriverPhoneNumber(e.target.value)}
                                    className="mt-2 w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Transfer Details */}
                        <div className="rounded-md border border-zinc-200 bg-zinc-50 space-y-1 text-sm text-zinc-600">
                            <div className="flex flex-row gap-5 justify-between px-5 py-2">
                                <div className=''>
                                    <h3 className='text-left mb-2 text-md'>From</h3>
                                    <span className="font-medium">{transfer.fromLocation.name}</span>
                                </div>
                                <div>
                                    <h3 className='text-left mb-2 text-md'>To</h3>
                                    <span className="font-medium">{transfer.toLocation.name}</span>
                                </div>
                                <div>
                                    <h3 className='text-left mb-2 text-md'>Status</h3>
                                    <span className="font-medium">{transfer.status.replace('_', ' ')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="rounded-md overflow-auto">
                            <table className="mt-2 w-full text-sm">
                                <thead className="bg-zinc-50 font-bold border border-zinc-200">
                                    <tr >
                                        <th className="border border-zinc-300 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-zinc-700">Product</th>
                                        <th className="border-r border-zinc-300 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-zinc-700">SKU</th>
                                        <th className="border-r border-zinc-300 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-zinc-700">Category</th>
                                        <th className="border-r border-zinc-300 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-zinc-700">Pack Size</th>
                                        <th className="border-r border-zinc-300 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-zinc-700">UoM</th>
                                        <th className="border-r border-zinc-300 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-zinc-700">Weight</th>
                                        <th className="border-r border-zinc-300 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-zinc-700">Quantity</th>
                                        <th className="border border-zinc-300 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-zinc-700">Tonnage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transfer.items.map((item, index) => (
                                        <tr key={index}
                                            className="divide-y divide-zinc-200"
                                        >
                                            <td className="border border-zinc-300 px-6 py-4 text-zinc-900">{item.product.name}</td>
                                            <td className="border-r border-zinc-300 px-6 py-4 text-zinc-900">{item.product.sku}</td>
                                            <td className="border-r border-zinc-300 px-6 py-4 text-zinc-900">{item.product.category}</td>
                                            <td className="border-r border-zinc-300 px-6 py-4 text-zinc-900">{item.product.packSize}</td>
                                            <td className="border-r border-zinc-300 px-6 py-4 text-zinc-900">{item.product.weightUnit}</td>
                                            <td className="border-r border-zinc-300 px-6 py-4 text-zinc-900">{(item.product.weightValue).toFixed(2)} {item.product.weightUnit}</td>
                                            <td className="border-r border-zinc-300 px-6 py-4 text-zinc-900">{item.quantity}</td>
                                            <td className="border border-zinc-300 px-6 py-4 text-zinc-900">{(item.product.weightValue * item.quantity / 1000).toFixed(2)} MT</td>
                                        </tr>
                                    ))}

                                    {/* Totals */}
                                    <tr className="bg-zinc-50 font-bold border border-zinc-200">
                                        <td className="border-b border-zinc-200 px-6 py-4 text-zinc-900 text-center" colSpan={6}>Total</td>
                                        <td className="border-b border-zinc-200 px-6 py-4 text-zinc-900">{totalQuantity}</td>
                                        <td className="border-b border-zinc-200 px-6 py-4 text-zinc-900">{totalTonnage} MT</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Warning */}
                        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                            Confirming dispatch will mark this transfer as <strong>in transit</strong>. Ensure transporter and driver details are correct.
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="rounded-md bg-red-500 px-5 py-2 text-sm font-medium text-white hover:bg-red-600"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Dispatch Transfer
                            </button>

                        </div>
                    </form>
                </div>
                <Toaster position="bottom-left" />
            </div>
        </div>
    );
};

export default DispatchTransferPage;
