-- DropIndex
DROP INDEX "Inventory_productId_idx";

-- CreateIndex
CREATE INDEX "Inventory_productId_createdBy_idx" ON "Inventory"("productId", "createdBy");
