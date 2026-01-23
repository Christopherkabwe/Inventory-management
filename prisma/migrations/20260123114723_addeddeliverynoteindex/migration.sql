-- AlterTable
ALTER TABLE "DeliveryNote" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "DeliveryNote_saleId_idx" ON "DeliveryNote"("saleId");

-- CreateIndex
CREATE INDEX "DeliveryNote_salesOrderId_idx" ON "DeliveryNote"("salesOrderId");
