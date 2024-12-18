/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Memo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `Memo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Memo" ADD COLUMN     "phone" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Memo_phone_key" ON "Memo"("phone");
