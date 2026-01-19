import React from 'react';
import { Printer } from 'lucide-react';
import printJS from 'print-js';
type PrintMode = 'portrait' | 'landscape';

const PrintButton = ({ mode = 'portrait' }: { mode?: PrintMode }) => {
    const handlePrint = () => {
        document.body.classList.remove('print-portrait', 'print-landscape');
        document.body.classList.add(`print-${mode}`);

        window.print();

        // cleanup after print
        setTimeout(() => {
            document.body.classList.remove('print-portrait', 'print-landscape');
        }, 1000);
    };

    return (
        <div className="flex justify-end mb-5 mt-5 no-print">
            <button
                className="rounded-lg bg-blue-600 px-4 py-2 text-white flex items-center gap-2 cursor-pointer"
                onClick={handlePrint}
            >
                <Printer /> Print
            </button>
        </div>
    );
};

export default PrintButton;