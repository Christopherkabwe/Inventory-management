import { EntityCombobox } from "./EntityComboBox";
export function LocationCombobox({ locations, value, onChange }) {
    return (
        <EntityCombobox
            items={locations.map((l) => ({
                id: l.id,
                label: l.name,
            }))}
            value={value}
            placeholder="Select location"
            searchPlaceholder="Search location..."
            onChange={onChange}
        />
    );
}
