"use client";

interface LoadingProps {
    message?: string;
    colSpan?: number;
    className?: string;
}

export default function Loading({ message = "Loading…", colSpan, className = "" }: LoadingProps) {
    const content = (
        <div className="flex flex-col items-center justify-center h-full min-h-[25vh] text-gray-700">
            <svg
                className="animate-spin text-blue-600 mb-4 h-12 w-12 xl:h-15 xl:w-15"
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
            <p className="text-sm xl:text-2xl font-medium text-center">{message}</p>
        </div>
    );

    if (colSpan) {
        // For use inside a table
        return (
            <tr>
                <td colSpan={colSpan} className={`p-0 ${className}`}>
                    {content}
                </td>
            </tr>
        );
    }

    // For standalone use
    return <div className={`flex flex-col items-center justify-center min-h-[25vh] ${className}`}>{content}</div>;
}
