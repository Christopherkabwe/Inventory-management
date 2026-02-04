-- CreateEnum
CREATE TYPE "GRNStatus" AS ENUM ('DRAFT', 'RECEIVED', 'CLOSED');

-- AlterTable
ALTER TABLE "grn" ADD COLUMN     "status" "GRNStatus" NOT NULL DEFAULT 'DRAFT';
