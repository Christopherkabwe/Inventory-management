import { EntityCombobox } from "./EntityComboBox";

export function CategoryCombobox({ categories, value, onChange }) {
    return (
        <EntityCombobox
            items={categories.map((c) => ({
                id: c,
                label: c,
            }))}
            value={value}
            placeholder="Select category"
            searchPlaceholder="Search category..."
            onChange={onChange}
        />
    );
}
