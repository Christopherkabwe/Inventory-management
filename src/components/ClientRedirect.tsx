"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function ClientRedirect() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/dashboard/inventory');
        }, 3000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <p className="mt-8 text-sm text-gray-400">Redirecting to Inventory Dashboard in 3 seconds...</p>
    );
}


