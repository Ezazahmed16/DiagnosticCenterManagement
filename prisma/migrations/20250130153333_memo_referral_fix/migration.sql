/*
  Warnings:

  - You are about to drop the column `totalAmmount` on the `ReferredBy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ReferredBy" DROP COLUMN "totalAmmount",
ADD COLUMN     "totalAmount" DOUBLE PRECISION;
