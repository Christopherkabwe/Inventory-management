/*
  Warnings:

  - A unique constraint covering the columns `[saleId]` on the table `DeliveryNote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DeliveryNote_saleId_key" ON "DeliveryNote"("saleId");
