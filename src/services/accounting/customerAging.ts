// src/services/accounting/customerAging.ts
export async function getCustomerAging(customerId: string) {
    return prisma.$queryRawUnsafe(`
    SELECT
      SUM(CASE WHEN CURRENT_DATE - s."saleDate" <= 30 THEN si.total ELSE 0 END) AS current,
      SUM(CASE WHEN CURRENT_DATE - s."saleDate" BETWEEN 31 AND 60 THEN si.total ELSE 0 END) AS days_30,
      SUM(CASE WHEN CURRENT_DATE - s."saleDate" BETWEEN 61 AND 90 THEN si.total ELSE 0 END) AS days_60,
      SUM(CASE WHEN CURRENT_DATE - s."saleDate" > 90 THEN si.total ELSE 0 END) AS days_90
    FROM "Sale" s
    JOIN "SaleItem" si ON si."saleId" = s.id
    WHERE s."customerId" = $1
      AND s."paymentStatus" != 'PAID'
  `, customerId)
}
