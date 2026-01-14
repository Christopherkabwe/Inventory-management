"use client";
import { useActionState, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { editInventory } from "@/lib/actions/products";
import { checkAdminRoleAction } from "@/lib/actions/auth/CheckAdminRole";

interface Product {
    id: string;
    name: string;
    price: number;
}

interface Location {
    id: string;
    name: string;
}

interface User {
    id: string;
    fullName: string;
}

interface InventoryData {
    id: string;
    quantity: number;
    lowStockAt: number;
    expiryDate?: string; // ISO string
    assignedUser?: User | null;
    location: Location;
    product: Product;
}

interface Props {
    inventory: InventoryData;
    locations: Location[];
}

export default function EditInventoryButton({ inventory, locations }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [state, dispatch, isPending] = useActionState(editInventory, {
        message: null,
        success: false,
    });
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

    const handleEditClick = async () => {
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
        <div className="">
            <button
                type="button"
                onClick={handleEditClick}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Edit
            </button>
            {isOpen && (
                <div className="overflow-hidden fixed inset-0 bg-black bg-opacity-80 backdrop-blur-xl flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-100">
                        <h2 className="text-lg font-semibold mb-4">
                            Edit Inventory: {inventory.product.name}
                        </h2>
                        <form action={dispatch} className="space-y-4">
                            <input type="hidden" name="id" value={inventory.id} />
                            <input type="hidden" name="locationId" value={locationId} />
                            {/* Product Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product
                                </label>
                                <input
                                    type="text"
                                    value={inventory.product.name}
                                    disabled
                                    className="w-full px-3 py-2 border rounded bg-gray-100"
                                />
                            </div>
                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price (K)
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    defaultValue={inventory.product.price}
                                    step="0.01"
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    defaultValue={inventory.quantity}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            {/* Low Stock */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Low Stock At
                                </label>
                                <input
                                    type="number"
                                    name="lowStockAt"
                                    defaultValue={inventory.lowStockAt}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            {/* Expiry Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Expiry Date
                                </label>
                                <input
                                    type="date"
                                    name="expiryDate"
                                    defaultValue={
                                        inventory.expiryDate
                                            ? new Date(inventory.expiryDate).toISOString().split("T")[0]
                                            : ""
                                    }
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            {/* Assigned User */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Assigned User
                                </label>
                                <input
                                    type="text"
                                    value={inventory.assignedUser?.fullName || "Unassigned"}
                                    disabled
                                    className="w-full px-3 py-2 border rounded bg-gray-100"
                                />
                            </div>
                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>
                                <select
                                    value={locationId}
                                    onChange={(e) => setLocationId(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                >
                                    {locations.map((loc) => (
                                        <option key={loc.id} value={loc.id}>
                                            {loc.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Buttons */}
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
        </div>
    );
}
