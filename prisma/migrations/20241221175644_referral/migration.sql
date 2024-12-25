/*
  Warnings:

  - Made the column `phone` on table `ReferredBy` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ReferredBy" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "totalAmmount" DROP NOT NULL;
