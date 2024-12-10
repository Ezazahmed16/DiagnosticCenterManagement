/*
  Warnings:

  - You are about to drop the column `commitionPercent` on the `ReferredBy` table. All the data in the column will be lost.
  - Added the required column `commissionPercent` to the `ReferredBy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReferredBy" DROP COLUMN "commitionPercent",
ADD COLUMN     "commissionPercent" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "totalAmmount" SET DATA TYPE DOUBLE PRECISION;
