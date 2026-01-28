-- CreateEnum
CREATE TYPE "AllocationAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'ROLLBACK');

-- CreateTable
CREATE TABLE "AllocationHistory" (
    "id" TEXT NOT NULL,
    "allocationId" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "customerPaymentId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "action" "AllocationAction" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,
    "notes" TEXT,

    CONSTRAINT "AllocationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllocationAudit" (
    "id" TEXT NOT NULL,
    "customerPaymentId" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "oldAmount" DECIMAL(65,30) NOT NULL,
    "newAmount" DECIMAL(65,30) NOT NULL,
    "action" "AllocationAction" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "reason" TEXT,

    CONSTRAINT "AllocationAudit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AllocationHistory" ADD CONSTRAINT "AllocationHistory_allocationId_fkey" FOREIGN KEY ("allocationId") REFERENCES "PaymentAllocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
