-- CreateEnum
CREATE TYPE "DefectType" AS ENUM ('PACKAGING', 'CONTAMINATION', 'WEIGHT_VARIANCE', 'DAMAGED', 'EXPIRED', 'OTHER');

-- CreateEnum
CREATE TYPE "DefectDisposition" AS ENUM ('SCRAPPED', 'REWORKED', 'RETURNED', 'HELD');

-- CreateTable
CREATE TABLE "ProductionDefect" (
    "id" TEXT NOT NULL,
    "productionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "defectType" "DefectType" NOT NULL,
    "reason" TEXT,
    "disposition" "DefectDisposition" NOT NULL DEFAULT 'SCRAPPED',
    "recordedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionDefect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductionDefect_productionId_idx" ON "ProductionDefect"("productionId");

-- CreateIndex
CREATE INDEX "ProductionDefect_productId_idx" ON "ProductionDefect"("productId");

-- AddForeignKey
ALTER TABLE "ProductionDefect" ADD CONSTRAINT "ProductionDefect_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES "Production"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionDefect" ADD CONSTRAINT "ProductionDefect_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionDefect" ADD CONSTRAINT "ProductionDefect_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
