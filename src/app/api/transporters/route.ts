// -------------------- GET /api/transporters --------------------

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";
import { requireRole, UserRole } from "@/lib/rbac";

// -------------------- GET /api/transporters --------------------
export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        // Fetch all transporters, ordered by name
        const transporters = await prisma.transporter.findMany({
            orderBy: { name: "asc" },
        });

        // Remove duplicates by name
        const uniqueTransporters = Array.from(
            new Map(transporters.map(t => [t.name, t])).values()
        );

        return NextResponse.json(uniqueTransporters);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch transporters" }, { status: 500 });
    }
}

// -------------------- POST /api/transporters --------------------
export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // RBAC CHECK
        requireRole(user, [UserRole.ADMIN]);

        const body = await req.json();

        const transporter = await prisma.transporter.create({
            data: {
                name: body.name,
                vehicleNumber: body.vehicleNumber || null,
                driverName: body.driverName || null,
                driverPhoneNumber: body.driverPhoneNumber || null,
            },
        });

        return NextResponse.json({ transporter });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to create transporter" },
            { status: 500 }
        );
    }
}
