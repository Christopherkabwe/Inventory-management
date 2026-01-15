import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET PRODUCTS
export const getProducts = async (req, res) => {
    const products = await prisma.productList.findMany();
    res.json({ data: products });
};