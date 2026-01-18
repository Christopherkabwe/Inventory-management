-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "InventorySource" ADD VALUE 'TRANSFER_IN_TRANSIT';
ALTER TYPE "InventorySource" ADD VALUE 'TRANSFER_DAMAGED';
ALTER TYPE "InventorySource" ADD VALUE 'TRANSFER_EXPIRED';

-- AlterTable
ALTER TABLE "InventoryHistory" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "metadata" JSONB;

-- AddForeignKey
ALTER TABLE "InventoryHistory" ADD CONSTRAINT "InventoryHistory_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
