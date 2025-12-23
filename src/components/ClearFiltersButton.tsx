"use client";
import { useRouter } from 'next/navigation';

interface Props {
    onClear?: () => void;
}

export default function ClearFiltersButton({ onClear }: Props) {
    const router = useRouter();

    const handleClearFilters = () => {
        if (onClear) onClear();
        router.push('/inventory', { shallow: true });
    };

    return (
        <button
            type="button"
            onClick={handleClearFilters}
            className="w-full px-2 py-1 border border-gray-300 bg-red-500 text-white rounded-lg hover:bg-red-600 mt-6 cursor-pointer"
        >
            Clear Filters
        </button>
    );
}