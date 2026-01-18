import { EntityCombobox } from "./EntityComboBox";

export function ProductCombobox({ products, value, onChange }) {
    return (
        <EntityCombobox
            items={products.map((p) => ({
                id: p.id,
                label: p.name,
            }))}
            value={value}
            placeholder="Select product"
            searchPlaceholder="Search product..."
            onChange={onChange}
        />
    );
}
