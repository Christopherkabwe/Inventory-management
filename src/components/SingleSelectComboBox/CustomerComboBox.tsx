import { EntityCombobox } from "./EntityComboBox";

interface Customer {
    id: string;
    name: string;
}

interface CustomerComboboxProps {
    customers: Customer[];
    value: string;
    onChange: (id: string) => void;
    disabled?: boolean;
    label?: string;
}

export function CustomerCombobox({
    customers,
    value,
    onChange,
    disabled = false,
    label,
}: CustomerComboboxProps) {
    return (
        <EntityCombobox
            items={customers.map((c) => ({ id: c.id, label: c.name }))}
            value={value}
            onChange={onChange}
            placeholder="Select customer"
            searchPlaceholder="Search customer..."
            disabled={disabled}
            label={label}
        />
    );
}
