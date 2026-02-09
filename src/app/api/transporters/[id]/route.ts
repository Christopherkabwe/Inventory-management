import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// -------------------- GET /api/transporters/:id --------------------
// Used when opening edit form
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    const { id } = await params;
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const transporter = await prisma.transporter.findUnique({
            where: { id },
        });

        if (!transporter) {
            return NextResponse.json({ error: "Transporter not found" }, { status: 404 });
        }

        return NextResponse.json(transporter);
    } catch (error) {
        console.error("Fetch transporter failed:", error);
        return NextResponse.json(
            { error: "Failed to fetch transporter" },
            { status: 500 }
        );
    }
}


// -------------------- PUT /api/transporters/:id --------------------
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    const { id } = await params;
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // RBAC: Only ADMIN can update
        if (user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized: Admin required" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { name, vehicleNumber, driverName, driverPhoneNumber } = body;

        if (!name) {
            return NextResponse.json(
                { error: "Transporter name is required" },
                { status: 400 }
            );
        }
        const updatedTransporter = await prisma.transporter.update({
            where: { id },
            data: {
                name,
                vehicleNumber: vehicleNumber || null,
                driverName: driverName || null,
                driverPhoneNumber: driverPhoneNumber || null,
            },
        });

        return NextResponse.json({
            success: true,
            transporter: updatedTransporter,
        });

    } catch (error) {
        console.error("Update transporter failed:", error);
        return NextResponse.json(
            { error: "Failed to update transporter" },
            { status: 500 }
        );
    }
}


// -------------------- DELETE /api/transporters/:id --------------------
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // RBAC: Only ADMIN can delete
        if (user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized: Admin required" },
                { status: 403 }
            );
        }

        const transporter = await prisma.transporter.findUnique({
            where: { id },
        });

        if (!transporter) {
            return NextResponse.json({ error: "Transporter not found" }, { status: 404 });
        }

        await prisma.transporter.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "Transporter deleted successfully",
        });

    } catch (error) {
        console.error("Delete transporter failed:", error);
        return NextResponse.json(
            { error: "Failed to delete transporter" },
            { status: 500 }
        );
    }
}
