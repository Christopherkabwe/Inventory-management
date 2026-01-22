import { EntityCombobox } from "./EntityComboBox";

interface CategoryComboboxProps {
    categories: string[];
    value: string;
    onChange: (category: string) => void;
    disabled?: boolean;
    label?: string;
}

export function CategoryCombobox({
    categories,
    value,
    onChange,
    disabled = false,
    label,
}: CategoryComboboxProps) {
    return (
        <EntityCombobox
            items={categories.map((c) => ({ id: c, label: c }))}
            value={value}
            onChange={onChange}
            placeholder="Select category"
            searchPlaceholder="Search category..."
            disabled={disabled}
            label={label}
        />
    );
}
