import { EntityCombobox } from "./EntityComboBox";

interface Product {
    id: string;
    name: string;
}

interface ProductComboboxProps {
    products: Product[];
    value: string;
    onChange: (id: string) => void;
    disabled?: boolean;
    label?: string;
}

export function ProductCombobox({
    products,
    value,
    onChange,
    disabled = false,
    label,
}: ProductComboboxProps) {
    return (
        <EntityCombobox
            items={products.map((p) => ({ id: p.id, label: p.name }))}
            value={value}
            onChange={onChange}
            placeholder="Select product"
            searchPlaceholder="Search product..."
            disabled={disabled}
            label={label}
        />
    );
}
