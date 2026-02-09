-- CreateEnum
CREATE TYPE "SequenceAction" AS ENUM ('RESET', 'LOCK', 'UNLOCK');

-- AlterTable
ALTER TABLE "Sequence" ADD COLUMN     "lastResetAt" TIMESTAMP(3),
ADD COLUMN     "locked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedById" TEXT;

-- CreateTable
CREATE TABLE "SequenceAudit" (
    "id" TEXT NOT NULL,
    "sequenceId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "oldValue" INTEGER NOT NULL,
    "newValue" INTEGER NOT NULL,
    "action" "SequenceAction" NOT NULL,
    "performedById" TEXT NOT NULL,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "sequenceYear" INTEGER,

    CONSTRAINT "SequenceAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SequenceAudit_sequenceId_year_idx" ON "SequenceAudit"("sequenceId", "year");

-- AddForeignKey
ALTER TABLE "Sequence" ADD CONSTRAINT "Sequence_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SequenceAudit" ADD CONSTRAINT "SequenceAudit_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SequenceAudit" ADD CONSTRAINT "SequenceAudit_sequenceId_sequenceYear_fkey" FOREIGN KEY ("sequenceId", "sequenceYear") REFERENCES "Sequence"("id", "year") ON DELETE RESTRICT ON UPDATE CASCADE;
