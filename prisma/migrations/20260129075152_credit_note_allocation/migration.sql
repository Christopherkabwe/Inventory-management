-- CreateTable
CREATE TABLE "CreditNoteAllocation" (
    "id" TEXT NOT NULL,
    "creditNoteId" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditNoteAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreditNoteAllocation_saleId_idx" ON "CreditNoteAllocation"("saleId");

-- CreateIndex
CREATE INDEX "CreditNoteAllocation_creditNoteId_idx" ON "CreditNoteAllocation"("creditNoteId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditNoteAllocation_creditNoteId_saleId_key" ON "CreditNoteAllocation"("creditNoteId", "saleId");

-- AddForeignKey
ALTER TABLE "CreditNoteAllocation" ADD CONSTRAINT "CreditNoteAllocation_creditNoteId_fkey" FOREIGN KEY ("creditNoteId") REFERENCES "CreditNote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditNoteAllocation" ADD CONSTRAINT "CreditNoteAllocation_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
