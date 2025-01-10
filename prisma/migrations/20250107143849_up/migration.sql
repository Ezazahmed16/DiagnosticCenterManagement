/*
  Warnings:

  - You are about to drop the column `performedById` on the `Test` table. All the data in the column will be lost.
  - You are about to drop the `_MemoTests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_performedById_fkey";

-- DropForeignKey
ALTER TABLE "_MemoTests" DROP CONSTRAINT "_MemoTests_A_fkey";

-- DropForeignKey
ALTER TABLE "_MemoTests" DROP CONSTRAINT "_MemoTests_B_fkey";

-- AlterTable
ALTER TABLE "Asset" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ExpenseType" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Memo" ALTER COLUMN "dateOfBirth" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "MemoToTest" ADD COLUMN     "performedById" TEXT,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "dateOfBirth" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "PerformedBy" ADD COLUMN     "commission" DOUBLE PRECISION,
ADD COLUMN     "dueAmount" DOUBLE PRECISION,
ADD COLUMN     "payable" DOUBLE PRECISION,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalPerformed" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ReferralPayment" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ReferredBy" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Test" DROP COLUMN "performedById";

-- DropTable
DROP TABLE "_MemoTests";

-- CreateTable
CREATE TABLE "PerformerPayment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "performedById" TEXT NOT NULL,

    CONSTRAINT "PerformerPayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MemoToTest" ADD CONSTRAINT "MemoToTest_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "PerformedBy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoToTest" ADD CONSTRAINT "MemoToTest_memoId_fkey" FOREIGN KEY ("memoId") REFERENCES "Memo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformerPayment" ADD CONSTRAINT "PerformerPayment_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "PerformedBy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
