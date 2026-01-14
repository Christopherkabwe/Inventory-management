-- CreateEnum
CREATE TYPE "ProductionStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'LOCKED');

-- CreateIndex
CREATE INDEX "Production_createdAt_idx" ON "Production"("createdAt");

-- CreateIndex
CREATE INDEX "Production_locationId_idx" ON "Production"("locationId");

-- CreateIndex
CREATE INDEX "Production_batchNumber_idx" ON "Production"("batchNumber");
