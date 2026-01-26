import { prisma } from "@/lib/prisma"

async function migratePayments() {
    console.log("🚀 Starting payment migration...");

    const salePayments = await prisma.salePayment.findMany({
        include: {
            sale: {
                include: {
                    customer: true,
                },
            },
        },
    });

    console.log(`Found ${salePayments.length} sale payments`);

    for (const sp of salePayments) {
        await prisma.$transaction(async (tx) => {
            // 🔒 Prevent duplicates
            const existing = await tx.paymentAllocation.findFirst({
                where: {
                    saleId: sp.saleId,
                    amount: sp.amount,
                },
            });

            if (existing) {
                console.log(`⏭️ Skipping payment ${sp.id} (already migrated)`);
                return;
            }

            // 1️⃣ Create CustomerPayment
            const customerPayment = await tx.customerPayment.create({
                data: {
                    amount: sp.amount,
                    method: sp.method,
                    reference: sp.reference,
                    paymentDate: sp.createdAt,

                    // ✅ real customer
                    customer: {
                        connect: { id: sp.sale.customerId },
                    },

                    // ✅ real user (from the sale)
                    createdBy: {
                        connect: { id: sp.sale.createdById },
                    },
                },
            });

            // 2️⃣ Allocate to sale
            await tx.paymentAllocation.create({
                data: {
                    customerPaymentId: customerPayment.id,
                    saleId: sp.saleId,
                    amount: sp.amount,
                },
            });

            console.log(`✅ Migrated payment ${sp.id}`);
        });
    }

    console.log("🎉 Payment migration complete");
}

migratePayments()
    .catch(e => { console.error("❌ Migrate payments failed:", e); process.exit(1); })
    .finally(() => prisma.$disconnect());