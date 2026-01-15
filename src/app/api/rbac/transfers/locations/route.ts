import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET LOCATIONS
export const getLocations = async (req, res) => {
    const locations = await prisma.location.findMany();
    res.json({ data: locations });
};


