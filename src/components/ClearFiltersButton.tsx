"use client";
import { useRouter } from 'next/navigation';

interface Props {
    onClear?: () => void;
}

export default function ClearFiltersButton({ onClear }: Props) {
    const router = useRouter();

    const handleClearFilters = () => {
        if (onClear) onClear();
        router.push('/inventory/inventory', { shallow: true });
    };

    return (
        <button
            type="button"
            onClick={handleClearFilters}
            className="w-35 h-8 px-2 py-1 bg-red-500 text-white rounded-sm hover:bg-red-600 cursor-pointer"
        >
            Clear Filters
        </button>
    );
}