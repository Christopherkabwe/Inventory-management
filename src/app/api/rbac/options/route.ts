// app/api/rbac/options/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getLocations, getCategories, getProducts } from '@/lib/actions/dataFetchers';

export async function GET(req: NextRequest) {
    try {
        const [locations, categories, products] = await Promise.all([
            getLocations(),
            getCategories(),
            getProducts(),
        ]);

        return NextResponse.json({
            locations,
            categories,
            products,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch options' }, { status: 500 });
    }
}