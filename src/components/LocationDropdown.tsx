"use client";
import { useState, useRef, useEffect } from "react";

interface Location {
    id: string;
    name: string;
}
interface Props {
    uniqueLocations: Location[];
    selectedLocations: string[];
    onLocationsChange: (locations: string[]) => void;
}

export default function LocationDropdown({
    uniqueLocations,
    selectedLocations,
    onLocationsChange,
}: Props) {
    const [locations, setLocations] = useState<string[]>(selectedLocations);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLocations(selectedLocations);
    }, [selectedLocations]);

    const toggleLocation = (name: string) => {
        const newLocations = locations.includes(name)
            ? locations.filter((l) => l !== name)
            : [...locations, name];
        setLocations(newLocations);
        onLocationsChange(newLocations);
    };

    const clearAll = () => {
        setLocations([]);
        onLocationsChange([]);
    };

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
            <div>
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-expanded={open}
                    className="flex items-center justify-between w-full h-8 px-2 py-1 border border-gray-300 rounded-lg focus:outline focus:ring-2 focus:ring-gray-300"
                >
                    <span>
                        {locations.length === 0 ? "Select location" : `${locations.length} selected`}
                    </span>
                    <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {open && (
                    <div className="absolute z-20 mt-2 w-64 bg-white border border-purple-300 rounded-lg hover:shadow-lg p-3">
                        <button
                            type="button"
                            onClick={clearAll}
                            className="text-purple-600 text-sm font-medium mb-2 hover:underline text-left cursor-pointer"
                        >
                            Clear Selection
                        </button>
                        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                            {uniqueLocations.length === 0 ? (
                                <p className="text-sm text-gray-500">No locations available.</p>
                            ) : (
                                uniqueLocations.map((loc) => (
                                    <label key={loc.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 p-1 rounded">
                                        <input
                                            type="checkbox"
                                            checked={locations.includes(loc.name)}
                                            onChange={() => toggleLocation(loc.name)}
                                            className="h-4 w-4 text-purple-600 border-gray-300 rounded cursor-pointer focus:ring-0"
                                        />
                                        {loc.name}
                                    </label>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
            {locations.map((name) => (
                <input key={name} type="hidden" name="locationName" value={name} />
            ))}
        </div>
    );
}