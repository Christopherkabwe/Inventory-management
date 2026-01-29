import { EntityCombobox } from "./EntityComboBox";

interface DropdownItem {
    id: string;
    label: string;
}

interface DropdownProps {
    items: DropdownItem[];
    value: string;
    onChange: (id: string) => void;
    disabled?: boolean;
    label?: string;
    placeholder?: string;
    className?: string; // add this
}

export function Dropdown({
    items,
    value,
    onChange,
    disabled = false,
    label,
    placeholder = "Select...",
    className = "",
}: DropdownProps) {
    return (
        <div className={className}>
            <EntityCombobox
                items={items}
                value={value}
                onChange={onChange}
                disabled={disabled}
                label={label}
                placeholder={placeholder}
                searchPlaceholder={`Search ${label || "item"}...`}
            />
        </div>
    );
}

{/*
<div className="flex justify-end mb-3">
    <Dropdown
    label=""
    value={auditFilter}
    onChange={(val) =>
        setAuditFilter(val as "ALL" | "ALLOCATE" | "ROLLBACK" | "UPDATE")
    }
    items={[
        { id: "ALL", label: "All" },
        { id: "ALLOCATE", label: "Allocate" },
        { id: "ROLLBACK", label: "Rollback" },
        { id: "UPDATE", label: "Update" },
        ]}
    />
</div>

*/}
