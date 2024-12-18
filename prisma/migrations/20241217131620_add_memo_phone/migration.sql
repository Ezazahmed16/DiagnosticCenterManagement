/*
  Warnings:

  - Added the required column `gender` to the `Memo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Memo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Memo" DROP CONSTRAINT "Memo_performedById_fkey";

-- AlterTable
ALTER TABLE "Memo" ADD COLUMN     "address" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "performedById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Memo" ADD CONSTRAINT "Memo_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "PerformedBy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
