/*
  Warnings:

  - You are about to drop the column `categoryId` on the `ProductList` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductList" DROP CONSTRAINT "ProductList_categoryId_fkey";

-- AlterTable
ALTER TABLE "ProductList" DROP COLUMN "categoryId",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "subCategory" TEXT;

-- DropTable
DROP TABLE "Category";
