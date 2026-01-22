export default function OrderActions({
    status,
    onCreateInvoice
}: {
    status: string;
    onCreateInvoice: () => void;
}) {
    return (
        <div className="flex gap-3">
            {status !== "CANCELLED" && (
                <button
                    onClick={onCreateInvoice}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    Create Invoice
                </button>
            )}
        </div>
    );
}
