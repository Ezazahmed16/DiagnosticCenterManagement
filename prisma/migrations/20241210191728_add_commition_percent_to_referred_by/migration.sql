/*
  Warnings:

  - Added the required column `commitionPercent` to the `ReferredBy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmmount` to the `ReferredBy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReferredBy" ADD COLUMN     "commitionPercent" INTEGER NOT NULL,
ADD COLUMN     "totalAmmount" INTEGER NOT NULL;
