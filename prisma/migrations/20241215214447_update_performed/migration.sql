/*
  Warnings:

  - You are about to drop the `TestPerformedBy` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TestPerformedBy" DROP CONSTRAINT "TestPerformedBy_performedById_fkey";

-- DropForeignKey
ALTER TABLE "TestPerformedBy" DROP CONSTRAINT "TestPerformedBy_testId_fkey";

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "performedById" TEXT;

-- DropTable
DROP TABLE "TestPerformedBy";

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "PerformedBy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
