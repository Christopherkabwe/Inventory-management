"use client";

import MultiSelect, { MultiSelectOption } from "@/components/Multiselect/MultiSelect";

interface UserSelectProps {
    users: MultiSelectOption[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    searchable?: boolean;
}

export default function UserSelect({
    users,
    value,
    onChange,
    placeholder = "Select users",
    searchable = true,
}: UserSelectProps) {
    return (
        <MultiSelect
            label="Users"
            options={users}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            searchable={searchable}
        />
    );
}
