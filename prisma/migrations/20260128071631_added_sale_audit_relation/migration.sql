-- AlterTable
ALTER TABLE "PaymentAllocation" ADD COLUMN     "createdById" TEXT;

-- CreateIndex
CREATE INDEX "AllocationAudit_customerPaymentId_idx" ON "AllocationAudit"("customerPaymentId");

-- CreateIndex
CREATE INDEX "AllocationAudit_saleId_idx" ON "AllocationAudit"("saleId");

-- CreateIndex
CREATE INDEX "AllocationAudit_createdById_idx" ON "AllocationAudit"("createdById");

-- AddForeignKey
ALTER TABLE "PaymentAllocation" ADD CONSTRAINT "PaymentAllocation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllocationAudit" ADD CONSTRAINT "AllocationAudit_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllocationAudit" ADD CONSTRAINT "AllocationAudit_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
