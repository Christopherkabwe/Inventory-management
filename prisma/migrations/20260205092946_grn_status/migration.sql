/*
  Warnings:

  - The values [PARTIALY_RECEIVED] on the enum `GRNStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GRNStatus_new" AS ENUM ('DRAFT', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CLOSED');
ALTER TABLE "public"."GRN" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "GRN" ALTER COLUMN "status" TYPE "GRNStatus_new" USING ("status"::text::"GRNStatus_new");
ALTER TYPE "GRNStatus" RENAME TO "GRNStatus_old";
ALTER TYPE "GRNStatus_new" RENAME TO "GRNStatus";
DROP TYPE "public"."GRNStatus_old";
ALTER TABLE "GRN" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;
