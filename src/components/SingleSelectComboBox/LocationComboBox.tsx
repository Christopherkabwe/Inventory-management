import { EntityCombobox } from "./EntityComboBox";

// Define the Location interface
interface Location {
    id: string;
    name: string;
}

// Define the props for the combobox
interface LocationComboboxProps {
    locations: Location[];
    value: string;
    onChange: (id: string) => void;
}

export function LocationCombobox({ locations, value, onChange }: LocationComboboxProps) {
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
