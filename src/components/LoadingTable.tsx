"use client";

interface LoadingTableProps {
    colSpan: number;
    message?: string;
}

export default function LoadingTable({ colSpan, message = "Loading…" }: LoadingTableProps) {
    return (
        <tr>
            <td colSpan={colSpan} className="p-4 text-center">
                <div className="flex flex-col items-center justify-center min-h-[25vh]">
                    <svg
                        className="animate-spin text-blue-600 mb-2 h-12 w-12"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                        />
                    </svg>
                    <span className="text-lg font-medium">{message}</span>
                </div>
            </td>
        </tr>
    );
}
