/*
  Warnings:

  - A unique constraint covering the columns `[memoNo]` on the table `Memo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Memo" ADD COLUMN     "memoNo" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Memo_memoNo_key" ON "Memo"("memoNo");
