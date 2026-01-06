import { prisma } from "@/lib/prisma";

export async function ClearDatabase() {
    console.log("🧹 Clearing database...");
    try {
        // DELIVERY NOTES
        await prisma.deliveryNoteItem.deleteMany();
        await prisma.deliveryNote.deleteMany();

        // SALES
        await prisma.saleItem.deleteMany();
        await prisma.saleReturn.deleteMany();
        await prisma.creditNote.deleteMany();
        await prisma.sale.deleteMany();

        // ORDERS
        await prisma.salesOrderItem.deleteMany();
        await prisma.salesOrder.deleteMany();

        // TRANSFERS
        await prisma.transferReceiptItem.deleteMany();
        await prisma.transferReceipt.deleteMany();
        await prisma.transferItem.deleteMany();
        await prisma.transfer.deleteMany();

        // INVENTORY
        await prisma.inventory.deleteMany();

        // ADJUSTMENTS
        await prisma.adjustmentItem.deleteMany();
        await prisma.adjustment.deleteMany();

        // PRODUCTIONS
        await prisma.productionItem.deleteMany();
        await prisma.production.deleteMany();

        // QUOTATIONS
        await prisma.quotationItem.deleteMany();
        await prisma.quotation.deleteMany();

        // CUSTOMERS
        await prisma.customer.deleteMany();

        // PRODUCTS
        await prisma.productList.deleteMany();

        // LOCATIONS
        //await prisma.location.deleteMany();//

        console.log("✅ Database cleared successfully");
    } catch (err) {
        console.error("Error clearing database:", err);
    }
}

ClearDatabase();