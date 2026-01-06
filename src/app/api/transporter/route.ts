import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// -------------------- GET /api/transporters --------------------
export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser(); // ensure logged-in
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page") || 1);
        const limit = Number(searchParams.get("limit") || 20);
        const skip = (page - 1) * limit;

        const [transporters, total] = await Promise.all([
            prisma.transporter.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.transporter.count(),
        ]);

        return NextResponse.json({
            success: true,
            data: transporters,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Fetch transporters failed:", error);
        return NextResponse.json({ error: "Failed to fetch transporters", details: (error as Error).message }, { status: 500 });
    }
}

// -------------------- POST /api/transporters --------------------
export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Only ADMIN or MANAGER can create transporters
        if (!["ADMIN", "MANAGER"].includes(user.role)) {
            return NextResponse.json({ error: "Unauthorized: Admin or Manager required" }, { status: 403 });
        }

        const { name, vehicleNumber, driverName } = await req.json();

        if (!name) {
            return NextResponse.json({ error: "Transporter name is required" }, { status: 400 });
        }

        const transporter = await prisma.transporter.create({
            data: {
                name,
                vehicleNumber: vehicleNumber || null,
                driverName: driverName || null,
            },
        });

        return NextResponse.json({ success: true, transporter }, { status: 201 });
    } catch (error) {
        console.error("Create transporter failed:", error);
        return NextResponse.json({ error: "Failed to create transporter", details: (error as Error).message }, { status: 500 });
    }
}
