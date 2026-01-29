-- DropForeignKey
ALTER TABLE "AllocationAudit" DROP CONSTRAINT "AllocationAudit_createdById_fkey";

-- AlterTable
ALTER TABLE "AllocationAudit" ALTER COLUMN "createdById" DROP NOT NULL;

-- CreateTable
CREATE TABLE "AccountingPeriod" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "closedAt" TIMESTAMP(3),
    "closedBy" TEXT,

    CONSTRAINT "AccountingPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerStatement" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "periodYear" INTEGER NOT NULL,
    "periodMonth" INTEGER NOT NULL,
    "openingBalance" DECIMAL(65,30) NOT NULL,
    "closingBalance" DECIMAL(65,30) NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issuedById" TEXT NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CustomerStatement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerStatementLine" (
    "id" TEXT NOT NULL,
    "statementId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "reference" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "debit" DECIMAL(65,30) NOT NULL,
    "credit" DECIMAL(65,30) NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "CustomerStatementLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountingPeriod_year_month_key" ON "AccountingPeriod"("year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerStatement_customerId_periodYear_periodMonth_key" ON "CustomerStatement"("customerId", "periodYear", "periodMonth");

-- AddForeignKey
ALTER TABLE "AllocationAudit" ADD CONSTRAINT "AllocationAudit_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerStatement" ADD CONSTRAINT "CustomerStatement_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerStatementLine" ADD CONSTRAINT "CustomerStatementLine_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "CustomerStatement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
