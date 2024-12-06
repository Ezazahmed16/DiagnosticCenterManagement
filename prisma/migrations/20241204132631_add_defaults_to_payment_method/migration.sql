/*
  Warnings:

  - You are about to drop the column `amount` on the `Memo` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PAID', 'DUE');

-- AlterTable
ALTER TABLE "Memo" DROP COLUMN "amount",
ADD COLUMN     "dueAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'DUE',
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "additionalCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "testCost" DOUBLE PRECISION NOT NULL DEFAULT 0;
