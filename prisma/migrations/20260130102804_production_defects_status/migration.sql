-- AlterEnum
ALTER TYPE "InventorySource" ADD VALUE 'PRODUCTION_DEFECT';

-- AlterTable
ALTER TABLE "InventoryHistory" ADD COLUMN     "productionDefectId" TEXT;

-- AlterTable
ALTER TABLE "Production" ADD COLUMN     "status" "ProductionStatus" DEFAULT 'DRAFT';

-- AddForeignKey
ALTER TABLE "InventoryHistory" ADD CONSTRAINT "InventoryHistory_productionDefectId_fkey" FOREIGN KEY ("productionDefectId") REFERENCES "ProductionDefect"("id") ON DELETE SET NULL ON UPDATE CASCADE;
