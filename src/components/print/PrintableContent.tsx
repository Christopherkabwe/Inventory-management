// components/print/PrintableContent.tsx
import React, { useEffect } from 'react';

interface PrintableContentProps {
    children: React.ReactNode;
    printRef: React.RefObject<HTMLDivElement | null>;
}

const PrintableContent: React.FC<PrintableContentProps> = ({ children, printRef }) => {

    return (
        <div ref={printRef}>
            {children}
        </div>
    );
};


export default PrintableContent;