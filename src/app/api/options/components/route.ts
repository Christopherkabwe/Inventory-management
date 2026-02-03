import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// GET /api/options/components
export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const components = await prisma.productList.findMany({
            where: {
                type: {
                    in: ["RAW_MATERIAL", "PACKAGING", "SEMI_FINISHED"],
                },
            },
            include: {
                // include everything that might be useful in BOM / costing
                inventories: true,
                inventoryHistories: false, // ❌ too heavy – keep disabled
                createdBy: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json(components);
    } catch (error) {
        console.error("[COMPONENT_OPTIONS_ERROR]", error);

        return NextResponse.json(
            { message: "Failed to fetch components" },
            { status: 500 }
        );
    }
}
