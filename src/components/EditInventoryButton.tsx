"use client";
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { editInventory } from "@/lib/actions/products";

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
    locations: Location[];
}

export default function EditInventoryButton({ inventory, locations }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [state, dispatch, isPending] = useActionState(editInventory, { message: null, success: false });
    const [locationId, setLocationId] = useState(inventory.location.id);

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast.success(state.message);
            } else {
                toast.error(state.message);
            }
            setIsOpen(false);
        }
    }, [state]);

    return (
        <>
            <button
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setIsOpen(true)}
                type="button"
            >
                Edit
            </button>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">Edit Inventory: {inventory.product.name}</h2>
                        <form action={dispatch} className="space-y-4">
                            <input type="hidden" name="id" value={inventory.id} />
                            <input type="hidden" name="locationId" value={locationId} />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                                <input type="text" value={inventory.product.name} disabled className="w-full px-3 py-2 border rounded bg-gray-100" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (K)</label>
                                <input type="number" name="price" defaultValue={inventory.product.price} className="w-full px-3 py-2 border rounded" required step="0.01" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                <input type="number" name="quantity" defaultValue={inventory.quantity} className="w-full px-3 py-2 border rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock At</label>
                                <input type="number" name="lowStockAt" defaultValue={inventory.lowStockAt} className="w-full px-3 py-2 border rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <select
                                    value={locationId}
                                    onChange={(e) => setLocationId(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                >
                                    {locations.map(loc => (
                                        <option key={loc.id} value={loc.id}>
                                            {loc.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                                    disabled={isPending}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    disabled={isPending}
                                >
                                    {isPending ? "Updating inventory..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}