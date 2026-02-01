"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const delta = 2;
        const range: (number | string)[] = [];
        const rangeWithDots: (number | string)[] = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, "...");
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push("...", totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const visiblePages = getVisiblePages();

    return (
        <nav className="flex items-center justify-center gap-1">
            <button
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className={`flex items-center px-2 py-1 text-sm font-medium rounded-lg cursor-pointer
                    ${currentPage <= 1
                        ? "text-gray-500 cursor-not-allowed bg-gray-100"   // visually disabled but pointer still shows
                        : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100"
                    }`}
            >
                <ChevronLeft /> Previous
            </button>

            {visiblePages.map((page, index) =>
                page === "..." ? (
                    <span key={`dots-${index}`} className="px-2 py-1 text-sm text-black">
                        ...
                    </span>
                ) : (
                    <button
                        key={`page-${page}-${index}`}
                        onClick={() => onPageChange(Number(page))}
                        className={`px-2 py-1 text-sm font-medium rounded-lg cursor-pointer ${page === currentPage ? "bg-purple-600 text-white" : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
                            }`}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`flex items-center px-2 py-1 text-sm font-medium rounded-lg cursor-pointer ${currentPage >= totalPages
                    ? "text-gray-400 cursor-not-allowed bg-gray-100"
                    : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
                    }`}
            >
                Next <ChevronRight />
            </button>
        </nav>
    );
}


{/*
import Pagination from "@/components/pagination";
const ITEMS_PER_PAGE = 10;

const [currentPage, setCurrentPage] = useState(1);

const totalPages = Math.ceil(transfers.length / ITEMS_PER_PAGE);

const paginatedTransfers = transfers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
);

<div className="mt-4">
    <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
    />
</div>


*/}