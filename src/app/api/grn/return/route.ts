import { NextRequest, NextResponse } from "next/server";
import { returnGRNItem } from "@/modules/grn/grn.service";

export async function POST(req: NextRequest) {

    try {
        const { grnItemId, quantity } = await req.json();

        const result = await returnGRNItem(grnItemId, quantity);

        return NextResponse.json(result);

    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: 400 }
        );
    }
}
