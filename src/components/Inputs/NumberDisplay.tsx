type NumberDisplayProps = {
    value?: number | null
    decimals?: number
    className?: string
    prefix?: string
    suffix?: string
}

export function formatNumber(
    value: number | undefined | null,
    decimals: number = 2
): string {
    if (value === null || value === undefined) return "0.00"

    return value.toLocaleString("en-ZM", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })
}

export const NumberDisplay = ({
    value,
    decimals = 2,
    className = "",
    prefix = "",
    suffix = "",
}: NumberDisplayProps) => {
    return (
        <span className={className}>
            {prefix}
            {formatNumber(value, decimals)}
            {suffix}
        </span>
    )
}


{/*
    <NumberDisplay
    value={unallocated}
    decimals={2}
    className={unallocated < 0 ? "text-red-600" : "text-green-700"}
    prefix="K"
/>
*/}