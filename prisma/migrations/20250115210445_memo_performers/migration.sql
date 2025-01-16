/*
  Warnings:

  - You are about to drop the `PerformerPayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PerformerPayment" DROP CONSTRAINT "PerformerPayment_performedById_fkey";

-- AlterTable
ALTER TABLE "PerformedBy" ADD COLUMN     "paidAmounts" DOUBLE PRECISION;

-- DropTable
DROP TABLE "PerformerPayment";
