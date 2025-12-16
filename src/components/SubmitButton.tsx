"use client";

interface SubmitButtonProps {
    isSubmitting: boolean;
}

export function SubmitButton({ isSubmitting }: SubmitButtonProps) {
    return (
        <button
            type="submit"
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            disabled={isSubmitting}
        >
            {isSubmitting ? "Creating Sale..." : "Create Sale"}
        </button>
    );
}