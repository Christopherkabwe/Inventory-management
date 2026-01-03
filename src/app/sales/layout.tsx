// app/sales/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sales", // Used for pages that don’t override it
};

export default function SalesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="sales-layout">
            {children}
        </div>
    );
}
