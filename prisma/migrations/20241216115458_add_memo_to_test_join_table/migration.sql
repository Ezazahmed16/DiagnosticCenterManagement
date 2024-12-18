/*
  Warnings:

  - You are about to drop the column `memoId` on the `Test` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_memoId_fkey";

-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "dateOfBirth" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Test" DROP COLUMN "memoId";

-- CreateTable
CREATE TABLE "MemoToTest" (
    "id" TEXT NOT NULL,
    "memoId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemoToTest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MemoToTest" ADD CONSTRAINT "MemoToTest_memoId_fkey" FOREIGN KEY ("memoId") REFERENCES "Memo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoToTest" ADD CONSTRAINT "MemoToTest_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;
