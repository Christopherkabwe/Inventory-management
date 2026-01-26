type EmptyRowsProps = {
    columns: number;
    count: number;
    children?: React.ReactNode;
};

const EmptyRows = ({ columns, count, children }: EmptyRowsProps) => {
    const safeCount = Math.max(0, Math.floor(count || 0)); // ensure a valid integer >= 0

    const tdClass = (colIndex: number, isLastRow: boolean) => {
        const baseClass = "px-4 py-2";
        const borderClass =
            isLastRow
                ? "border-r border-black"
                : colIndex < columns - 1
                    ? "border-r border-black"
                    : "";
        return `${baseClass} ${borderClass}`;
    };

    return Array.from({ length: safeCount }).map((_, index) => (
        <tr key={`empty-${index}`}>
            {children ? (
                children
            ) : (
                Array.from({ length: columns }).map((_, colIndex) => (
                    <td
                        key={`empty-${index}-${colIndex}`}
                        className={tdClass(colIndex, index === safeCount - 1)}
                    >
                        &nbsp;
                    </td>
                ))
            )}
        </tr>
    ));
};

export default EmptyRows;
