import { MultiEntityCombobox } from "./MultiEntityComboBox";

export function MultiTransporterCombobox({
    transporters,
    values,
    onChange,
}: {
    transporters: { id: string; name: string }[];
    values: string[];
    onChange: (values: string[]) => void;
}) {
    return (
        <MultiEntityCombobox
            items={transporters.map((t) => ({
                id: t.id,
                label: t.name,
            }))}
            values={values}
            placeholder="Select transporters"
            searchPlaceholder="Search transporter..."
            onChange={onChange}
        />
    );
}
