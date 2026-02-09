type DisplayFieldProps = {
    label: string;
    value?: string | number | null;
    placeholder?: string;
    className?: string;
};

export default function DisplayField({
    label,
    value,
    placeholder = "-",
    className = "",
}: DisplayFieldProps) {
    return (
        <div className={`grid grid-cols-1 ${className}`}>
            <div className="px-2 py-1">
                <p className="font-semibold text-sm">{label}</p>
            </div>

            <div className="px-2 py-1 border rounded-md shadow h-9 flex items-center">
                <p>{value ?? placeholder}</p>
            </div>
        </div>
    );
}


export function formatWeight(value?: number, unit?: string) {
    if (value == null) return "-";
    return `${value.toFixed(2)} ${unit ?? "Kg"}`;
}
