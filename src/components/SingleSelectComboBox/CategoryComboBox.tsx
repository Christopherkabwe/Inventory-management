import { EntityCombobox } from "./EntityComboBox";

// Props interface
interface CategoryComboboxProps {
    categories: string[];       // Array of category names (from product.category)
    value: string;              // Selected category
    onChange: (category: string) => void;  // Callback when a category is selected
}

export function CategoryCombobox({ categories, value, onChange }: CategoryComboboxProps) {
    return (
        <EntityCombobox
            items={categories.map((c) => ({
                id: c,       // The category string itself is the "id"
                label: c,    // Display label is also the string
            }))}
            value={value}
            placeholder="Select category"
            searchPlaceholder="Search category..."
            onChange={onChange}
        />
    );
}
