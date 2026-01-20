// src/app/api/transfers/raw/route.ts
import { NextResponse } from "next/server";
import { getAllTransfersRaw } from "@/lib/queries/transfers";

export async function GET() {
    const data = await getAllTransfersRaw();
    return NextResponse.json(data);
}
