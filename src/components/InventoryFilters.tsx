"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LocationDropdown from "@/components/LocationDropdown";
import ClearFiltersButton from "@/components/ClearFiltersButton";

interface Props {
    uniqueLocations: { id: string; name: string }[];
    initialQ: string;
    initialLocations: string[];
}

export default function InventoryFilters({ uniqueLocations, initialQ, initialLocations }: Props) {
    const router = useRouter();
    const [q, setQ] = useState(initialQ);
    const [locations, setLocations] = useState<string[]>(initialLocations);

    const handleLocationsChange = (newLocations: string[]) => {
        setLocations(newLocations);
    };

    const handleClearFilters = () => {
        setQ("");
        setLocations([]);
        router.push("/inventory", { shallow: true });
    };

    return (
        <div className="bg-white rounded-lg border-gray-200 p-6">
            <form action="/inventory" method="GET" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search Products</label>
                        <input
                            name="q"
                            placeholder="Search Products..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:ring-2 focus:ring-gray-500"
                        />
                    </div>
                    <LocationDropdown
                        uniqueLocations={uniqueLocations}
                        selectedLocations={locations}
                        onLocationsChange={handleLocationsChange}
                    />
                    <button type="submit" className="w-full px-2 py-1 border border-gray-300 bg-purple-600 text-white rounded-lg hover:bg-purple-700 mt-6 cursor-pointer">
                        Apply Filters
                    </button>
                    <ClearFiltersButton onClear={handleClearFilters} />
                </div>
            </form>
        </div>
    );
}