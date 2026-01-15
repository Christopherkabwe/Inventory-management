// -------------------- GET /api/transporters --------------------

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

// Define a schema for the transporter data
const transporterSchema = z.object({
    name: z.string().min(1).max(255),
    vehicleNumber: z.string().optional(),
    driverName: z.string().optional(),
});

// -------------------- GET /api/transporters --------------------
export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const transporters = await prisma.transporter.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                vehicleNumber: true,
                driverName: true,
                driverPhoneNumber: true,
            },
        });

        const uniqueTransporters = transporters.reduce((acc, current) => {
            if (!acc.find((transporter) => transporter.name === current.name)) {
                return [...acc, current];
            }
            return acc;
        }, []);

        return NextResponse.json({ success: true, data: uniqueTransporters }, { status: 200 });
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

        if (!["ADMIN", "MANAGER"].includes(user.role)) {
            return NextResponse.json({ error: "Unauthorized: Admin or Manager required" }, { status: 403 });
        }

        const data = await req.json();
        const { name, vehicleNumber, driverName } = transporterSchema.parse(data);

        const transporter = await prisma.transporter.create({
            data: {
                name,
                vehicleNumber: vehicleNumber || null,
                driverName: driverName || null,
            },
        });

        return NextResponse.json({ success: true, transporter }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid request data", details: error.issues }, { status: 400 });
        }

        console.error("Create transporter failed:", error);
        return NextResponse.json({ error: "Failed to create transporter", details: (error as Error).message }, { status: 500 });
    }
}