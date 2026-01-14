import { NextRequest, NextResponse } from "next/server";
import { getFilteredData, Filters, Pagination } from "@/lib/getFilteredData";

export async function POST(req: NextRequest) {
    try {
        const { model, filters, pagination }: { model: string; filters: Filters; pagination?: Pagination } = await req.json();

        if (!["inventory", "sale", "salesOrder"].includes(model)) {
            return NextResponse.json({ error: "Invalid model" }, { status: 400 });
        }

        const data = await getFilteredData(model as any, filters, pagination);
        return NextResponse.json({ data });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch filtered data" }, { status: 500 });
    }
}
