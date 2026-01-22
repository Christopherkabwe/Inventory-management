import { EntityCombobox } from "./EntityComboBox";

export function CustomerCombobox({
    customers,
    value,
    onChange,
}: {
    customers: { id: string; name: string }[];
    value: string;
    onChange: (id: string) => void;
}) {
    return (
        <EntityCombobox
            items={customers.map((c) => ({
                id: c.id,
                label: c.name,
            }))}
            value={value}
            placeholder="Select customer"
            searchPlaceholder="Search customer..."
            onChange={onChange}
        />
    );
}
