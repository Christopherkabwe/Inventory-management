"use client";

import MultiSelect, { MultiSelectOption } from "@/components/Dropdowns/MultiSelect";

interface CategorySelectProps {
    categories: MultiSelectOption[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    searchable?: boolean;
}

export default function CategorySelect({
    categories,
    value,
    onChange,
    placeholder = "Select categories",
    searchable = true,
}: CategorySelectProps) {
    return (
        <MultiSelect
            label="Categories"
            options={categories}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            searchable={searchable}
        />
    );
}
