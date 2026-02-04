// components/SupplierCombobox.tsx
import { EntityCombobox } from "./EntityComboBox";

interface Supplier {
    id: string;
    name: string;
}

interface SupplierComboboxProps {
    suppliers: Supplier[];
    value: string;
    onChange: (id: string) => void;
    disabled?: boolean;
    label?: string;
}

export function SupplierCombobox({
    suppliers,
    value,
    onChange,
    disabled = false,
    label,
}: SupplierComboboxProps) {
    return (
        <EntityCombobox
            items={suppliers.map((s) => ({ id: s.id, label: s.name }))}
            value={value}
            onChange={onChange}
            placeholder="Select supplier"
            searchPlaceholder="Search supplier..."
            disabled={disabled}
            label={label}
        />
    );
}
