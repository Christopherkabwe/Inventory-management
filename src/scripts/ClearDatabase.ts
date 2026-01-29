import { prisma } from "@/lib/prisma";

export async function ClearDatabase() {
    console.log("🧹 Clearing database…");

    try {
        // ============================
        // AUDIT / HISTORY (leaf nodes)
        // ============================
        await prisma.customerStatementLine.deleteMany();
        await prisma.customerStatement.deleteMany();

        await prisma.allocationHistory.deleteMany();
        await prisma.allocationAudit.deleteMany();

        await prisma.inventoryHistory.deleteMany();

        // ============================
        // PAYMENTS
        // ============================
        await prisma.paymentAllocation.deleteMany();
        await prisma.salePayment.deleteMany();
        await prisma.customerPayment.deleteMany();

        // ============================
        // SALES & RETURNS
        // ============================
        await prisma.saleReturnItem.deleteMany();
        await prisma.saleReturn.deleteMany();
        await prisma.creditNote.deleteMany();

        await prisma.saleItem.deleteMany();
        await prisma.sale.deleteMany();

        // ============================
        // DELIVERY NOTES
        // ============================
        await prisma.deliveryNoteItem.deleteMany();
        await prisma.deliveryNote.deleteMany();

        // ============================
        // SALES ORDERS
        // ============================
        await prisma.salesOrderItem.deleteMany();
        await prisma.salesOrder.deleteMany();

        // ============================
        // QUOTATIONS
        // ============================
        await prisma.quotationItem.deleteMany();
        await prisma.quotation.deleteMany();

        // ============================
        // PROFORMA INVOICES
        // ============================
        await prisma.proformaInvoiceItem.deleteMany();
        await prisma.proformaInvoice.deleteMany();

        // ============================
        // TRANSFERS
        // ============================
        await prisma.transferReceiptItem.deleteMany();
        await prisma.transferReceipt.deleteMany();

        await prisma.transferItem.deleteMany();
        await prisma.transfer.deleteMany();

        // ============================
        // PRODUCTION
        // ============================
        await prisma.productionItem.deleteMany();
        await prisma.production.deleteMany();

        // ============================
        // ADJUSTMENTS
        // ============================
        await prisma.adjustmentItem.deleteMany();
        await prisma.adjustment.deleteMany();

        // ============================
        // INVENTORY
        // ============================
        await prisma.inventory.deleteMany();

        // ============================
        // PRODUCTS
        // ============================
        await prisma.productList.deleteMany();

        // ============================
        // SEQUENCES & PERIODS
        // ============================
        await prisma.sequence.deleteMany();
        await prisma.accountingPeriod.deleteMany();

        // ============================
        // ❌ INTENTIONALLY NOT DELETED
        // ============================
        // await prisma.customer.deleteMany();
        // await prisma.location.deleteMany();
        // await prisma.user.deleteMany();

        console.log("✅ Database cleared successfully");
    } catch (err) {
        console.error("❌ Error clearing database:", err);
        throw err;
    }
}

// ⚠️ DEV / SEED ONLY
ClearDatabase();
