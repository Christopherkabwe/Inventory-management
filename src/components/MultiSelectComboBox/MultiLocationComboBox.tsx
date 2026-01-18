import { MultiEntityCombobox } from "./MultiEntityComboBox";

export function MultiLocationCombobox({ locations, values, onChange }) {
    return (
        <MultiEntityCombobox
            items={locations.map((l) => ({
                id: l.id,
                label: l.label,
            }))}
            values={values}
            placeholder="Select locations"
            searchPlaceholder="Search location..."
            onChange={onChange}
        />
    );
}
