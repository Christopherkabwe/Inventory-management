import { EntityCombobox } from "./EntityComboBox";
export function UserCombobox({ users, value, onChange }) {
    return (
        <EntityCombobox
            items={users.map((u) => ({
                id: u.id,
                label: u.fullName ?? u.email ?? "Unnamed user",
            }))}
            value={value}
            placeholder="Select user"
            searchPlaceholder="Search user..."
            onChange={onChange}
        />
    );
}
