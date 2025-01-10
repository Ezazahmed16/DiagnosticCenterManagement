/*
  Warnings:

  - You are about to drop the column `performedById` on the `Memo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Memo" DROP CONSTRAINT "Memo_performedById_fkey";

-- AlterTable
ALTER TABLE "Memo" DROP COLUMN "performedById";

-- AlterTable
ALTER TABLE "MemoToTest" ADD COLUMN     "deliveryTime" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "roomNo" TEXT,
ADD COLUMN     "testName" TEXT;
