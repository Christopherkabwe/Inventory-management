"use client";
import { useState, useRef, useEffect } from "react";

interface Location {
    id: string;
    name: string;
}
interface Props {
    uniqueLocations: Location[];
    selectedLocations: string[]; // array of location names
}

export default function LocationDropdown({ uniqueLocations, selectedLocations }: Props) {
    const [locations, setLocations] = useState<string[]>(selectedLocations);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Toggle a location in the selection
    const toggleLocation = (name: string) => {
        setLocations(prev =>
            prev.includes(name) ? prev.filter(l => l !== name) : [...prev, name]
        );
    };

    // Clear all selections
    const clearAll = () => setLocations([]);

    // Close dropdown if click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Locations
            </label>
            <div>
                <button
                    type="button"
                    onClick={() => setOpen(prev => !prev)}
                    aria-expanded={open}
                    className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 hover:bg-gray-50"
                >
                    <span>
                        {locations.length === 0 ? "All locations" : `${locations.length} selected`}
                    </span>
                    <svg
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>
                {open && (
                    <div className="absolute z-20 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                        <button
                            type="button"
                            onClick={clearAll}
                            className="text-purple-600 text-sm font-medium mb-2 hover:underline text-left"
                        >
                            Clear Selection
                        </button>
                        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                            {uniqueLocations.length === 0 ? (
                                <p className="text-sm text-gray-500">No locations available.</p>
                            ) : (
                                uniqueLocations.map(loc => (
                                    <label key={loc.id} className="flex items-center gap-2 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={locations.includes(loc.name)}
                                            onChange={() => toggleLocation(loc.name)}
                                            className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                                        />
                                        {loc.name}
                                    </label>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
            {/* Hidden inputs to submit the form */}
            {locations.map(name => (
                <input key={name} type="hidden" name="locationName" value={name} />
            ))}
        </div>
    );
}