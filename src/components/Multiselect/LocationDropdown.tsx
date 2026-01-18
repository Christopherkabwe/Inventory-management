"use client";

import MultiSelect, { MultiSelectOption } from "@/components/Multiselect/MultiSelect";

interface LocationSelectProps {
    locations: MultiSelectOption[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    searchable?: boolean;
}

export default function LocationSelect({
    locations,
    value,
    onChange,
    placeholder = "Select locations",
    searchable = true,
}: LocationSelectProps) {
    return (
        <MultiSelect
            label="Locations"
            options={locations}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            searchable={searchable}
        />
    );
}
