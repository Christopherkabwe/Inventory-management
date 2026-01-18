import React from 'react';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
    printRef: React.RefObject<HTMLDivElement | null>;
}

const PrintButton: React.FC<PrintButtonProps> = ({ printRef }) => {
    const handlePrint = () => {
        if (printRef.current) {
            const printContents = printRef.current.innerHTML;
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;

            const handleAfterPrint = () => {
                document.body.innerHTML = originalContents;
                document.body.style.pointerEvents = 'none';
                document.body.style.opacity = '0.5';
                setTimeout(() => {
                    window.location.replace(window.location.href);
                }, 100);
                window.removeEventListener('afterprint', handleAfterPrint);
            };

            window.addEventListener('afterprint', handleAfterPrint);
            window.print();
        }
    };

    return (
        <div className="flex flex-cols-1 gap-5 justify-end mb-5 mt-5">
            <button
                className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white flex items-center gap-2"
                onClick={handlePrint}
            >
                <Printer /> Print Page
            </button>
        </div>
    );
};

export default PrintButton;
