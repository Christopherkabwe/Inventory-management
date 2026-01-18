import { MultiEntityCombobox } from "./MultiEntityComboBox";

export function MultiProductCombobox({ products, values, onChange }) {
    return (
        <MultiEntityCombobox
            items={products.map((p) => ({
                id: p.id,
                label: p.name,
            }))}
            values={values}
            placeholder="Select products"
            searchPlaceholder="Search product..."
            onChange={onChange}
        />
    );
}
