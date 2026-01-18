import { MultiEntityCombobox } from "./MultiEntityComboBox";

interface Category {
    id: string;
    label: string;
}

interface MultiCategoryComboboxProps {
    categories: Category[];
    values: string[];
    onChange: (values: string[]) => void;
}

export function MultiCategoryCombobox({ categories, values, onChange }: MultiCategoryComboboxProps) {
    return (
        <MultiEntityCombobox
            items={categories.map(c => ({
                id: c.id,
                label: c.label,
            }))}
            values={values}
            placeholder="Select categories"
            searchPlaceholder="Search category..."
            onChange={onChange}
        />
    );
}
