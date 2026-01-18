"use client";

import MultiSelect, { MultiSelectOption } from "@/components/Multiselect/MultiSelect";

interface ProductSelectProps {
    products: MultiSelectOption[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    searchable?: boolean;
}

export default function ProductSelect({
    products,
    value,
    onChange,
    placeholder = "Select products",
    searchable = true,
}: ProductSelectProps) {
    return (
        <MultiSelect
            label="Products"
            options={products}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            searchable={searchable}
        />
    );
}
