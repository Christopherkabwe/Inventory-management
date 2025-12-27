"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LocationDropdown from "@/components/LocationDropdown";
import ClearFiltersButton from "@/components/ClearFiltersButton";
import { Input } from "@/components/ui/input";

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
        <div className="bg-white border border-gray-200 rounded-lg p-2">
            <form action="/inventory/inventory" method="GET" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Input
                            name="q"
                            placeholder="Search Products..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            className="w-full h-8 px-2 py-1 border border-gray-300 rounded-lg focus:outline focus:ring-2 focus:ring-gray-500"
                        />
                    </div>
                    <LocationDropdown
                        uniqueLocations={uniqueLocations}
                        selectedLocations={locations}
                        onLocationsChange={handleLocationsChange}
                    />
                    <div className="">
                        <button type="submit" className="w-35 h-8 px-2 py-1 mr-4 bg-purple-600 text-white rounded-sm hover:bg-purple-700 cursor-pointer">
                            Apply Filters
                        </button>
                        <ClearFiltersButton onClear={handleClearFilters} />
                    </div>
                </div>
            </form>
        </div>
    );
}