-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('RAW_MATERIAL', 'PACKAGING', 'SEMI_FINISHED', 'FINISHED');

-- AlterTable
ALTER TABLE "ProductList" ADD COLUMN     "type" "ProductType" NOT NULL DEFAULT 'FINISHED';
