/*
  Warnings:

  - You are about to drop the column `deliveryDate` on the `Test` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Test" DROP COLUMN "deliveryDate",
ADD COLUMN     "deliveryTime" TEXT;
