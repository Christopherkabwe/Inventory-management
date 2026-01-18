import { MultiEntityCombobox } from "./MultiEntityComboBox"

export function MultiUserCombobox({ users, values, onChange }) {
    return (
        <MultiEntityCombobox
            items={users.map((u) => ({
                id: u.id,
                label: u.fullName ?? u.email ?? "Unnamed user",
            }))}
            values={values}
            placeholder="Select users"
            searchPlaceholder="Search user..."
            onChange={onChange}
        />
    );
}


{/*
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

<MultiUsersCombobox
  users={users}
  values={selectedUsers}
  onChange={setSelectedUsers}
/>
 */}