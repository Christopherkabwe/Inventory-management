import { EntityCombobox } from "./EntityComboBox";

export function TransporterCombobox({ transporters, value, onChange }) {
    return (
        <EntityCombobox
            items={transporters.map((t) => ({
                id: t.id,
                label: t.name,
            }))}
            value={value}
            placeholder="Select transporter"
            searchPlaceholder="Search transporter..."
            onChange={onChange}
        />
    );
}
