import { EntityCombobox } from "./EntityComboBox";

interface Transporter {
    id: string;
    name: string;
}

interface TransporterComboboxProps {
    transporters: Transporter[];
    value: string;
    onChange: (id: string) => void;
    disabled?: boolean;
    label?: string;
}

export function TransporterCombobox({
    transporters,
    value,
    onChange,
    disabled = false,
    label,
}: TransporterComboboxProps) {
    return (
        <EntityCombobox
            items={transporters.map((t) => ({ id: t.id, label: t.name }))}
            value={value}
            onChange={onChange}
            placeholder="Select transporter"
            searchPlaceholder="Search transporter..."
            disabled={disabled}
            label={label}
        />
    );
}
