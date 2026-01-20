import { EntityCombobox } from "./EntityComboBox";

interface User {
    id: string;
    name: string;
}

interface UserComboboxProps {
    users: User[];
    value: string;
    onChange: (id: string) => void;
}

export function UserCombobox({ users, value, onChange }: UserComboboxProps) {
    return (
        <EntityCombobox
            items={users.map(u => ({
                id: u.id,
                label: u.name, // <-- use `name` instead of `fullName`
            }))}
            value={value}
            placeholder="Select user"
            searchPlaceholder="Search user..."
            onChange={onChange}
        />
    );
}
