"use client";
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { deleteFromInventory } from "@/lib/actions/products";
import { checkAdminRoleAction } from '@/lib/actions/auth/CheckAdminRole';

interface Product {
    name: string;
    price: number;
}

interface Location {
    id: string;
    name: string;
}

interface InventoryData {
    id: string;
    quantity: number;
    lowStockAt: number;
    location: Location;
    product: Product;
}

interface Props {
    inventory: InventoryData;
    onDelete: (id: string) => void; // callback to remove from table
}

export default function DeleteFromInventoryButton({ inventory, onDelete }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [state, dispatch, isPending] = useActionState(deleteFromInventory, { message: null, success: false });

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast.success(state.message);
                onDelete(inventory.id); // remove from table
            } else {
                toast.error(state.message);
            }
            setIsOpen(false);
        }
    }, [state.success]);

    const handleDeletClick = async () => {
        const response = await fetch('/api/auth/checkAdminRole', {
            method: 'POST',
        });
        const result = await response.json();
        if (result.error) {
            toast.error(result.error);
            return;
        }
        setIsOpen(true);
    };

    return (
        <>
            <button
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleDeletClick}
                type="button"
            >
                Delete
            </button>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Delete Inventory: {inventory.product.name}</h2>
                        <p className="mb-4 text-gray-600">
                            Location: <span className="font-medium">{inventory.location.name}</span><br />
                            Are you sure you want to delete this inventory item? This action cannot be undone.
                        </p>
                        <form action={dispatch} className="space-y-4">
                            <input type="hidden" name="id" value={inventory.id} />
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100" disabled={isPending}>
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" disabled={isPending}>
                                    {isPending ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
