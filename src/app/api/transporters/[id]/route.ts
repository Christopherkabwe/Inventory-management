// app/api/transporters/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// -------------------- PUT /api/transporters/:id --------------------
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Only ADMIN or MANAGER can update transporters
        if (!["ADMIN", "MANAGER"].includes(user.role)) {
            return NextResponse.json({ error: "Unauthorized: Admin or Manager required" }, { status: 403 });
        }

        const { name, vehicleNumber, driverName } = await req.json();
        if (!name) return NextResponse.json({ error: "Transporter name is required" }, { status: 400 });

        const updatedTransporter = await prisma.transporter.update({
            where: { id: params.id },
            data: { name, vehicleNumber: vehicleNumber || null, driverName: driverName || null },
        });

        return NextResponse.json({ success: true, transporter: updatedTransporter });
    } catch (error) {
        console.error("Update transporter failed:", error);
        return NextResponse.json({ error: "Failed to update transporter", details: (error as Error).message }, { status: 500 });
    }
}

// -------------------- DELETE /api/transporters/:id --------------------
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Only ADMIN or MANAGER can delete transporters
        if (!["ADMIN", "MANAGER"].includes(user.role)) {
            return NextResponse.json({ error: "Unauthorized: Admin or Manager required" }, { status: 403 });
        }

        const transporter = await prisma.transporter.findUnique({ where: { id: params.id } });
        if (!transporter) return NextResponse.json({ error: "Transporter not found" }, { status: 404 });

        await prisma.transporter.delete({ where: { id: params.id } });

        return NextResponse.json({ success: true, message: "Transporter deleted" });
    } catch (error) {
        console.error("Delete transporter failed:", error);
        return NextResponse.json({ error: "Failed to delete transporter", details: (error as Error).message }, { status: 500 });
    }
}
