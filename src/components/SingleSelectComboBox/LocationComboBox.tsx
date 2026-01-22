import { EntityCombobox } from "./EntityComboBox";

export interface Location {
    id: string;
    name: string;
}

interface LocationComboboxProps {
    locations: Location[];
    value: string;
    onChange: (id: string) => void;
    disabled?: boolean;
    label?: string;
}

export function LocationCombobox({
    locations,
    value,
    onChange,
    disabled = false,
    label,
}: LocationComboboxProps) {
    return (
        <EntityCombobox
            items={locations.map((l) => ({ id: l.id, label: l.name }))}
            value={value}
            onChange={onChange}
            placeholder="Select location"
            searchPlaceholder="Search location..."
            disabled={disabled}
            label={label}
        />
    );
}
