import { EntityCombobox } from "./EntityComboBox";

interface User {
    id: string;
    name: string;
}

interface UserComboboxProps {
    users: User[];
    value: string;
    onChange: (id: string) => void;
    disabled?: boolean;
    label?: string;
}

export function UserCombobox({
    users,
    value,
    onChange,
    disabled = false,
    label,
}: UserComboboxProps) {
    return (
        <EntityCombobox
            items={users.map((u) => ({ id: u.id, label: u.name }))}
            value={value}
            onChange={onChange}
            placeholder="Select user"
            searchPlaceholder="Search user..."
            disabled={disabled}
            label={label}
        />
    );
}
