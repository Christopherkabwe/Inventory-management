const EmptyRows = ({ columns, count, children }: EmptyRowsProps) => {
    const tdClass = (colIndex: number, isLastRow: boolean) => {
        const baseClass = "px-4 py-2";
        const borderClass = isLastRow
            ? "border-r border-black"
            : colIndex < columns - 1
                ? "border-r border-black"
                : "";
        return `${baseClass} ${borderClass}`;
    };

    return Array(count).fill(null).map((_, index) => (
        <tr key={`empty-${index}`}>
            {children ? children : Array(columns).fill(null).map((_, colIndex) => (
                <td key={`empty-${index}-${colIndex}`} className={tdClass(colIndex, index === count - 1)}>&nbsp;</td>
            ))}
        </tr>
    ));
};

export default EmptyRows;