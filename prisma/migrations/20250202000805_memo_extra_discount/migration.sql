-- AlterTable
ALTER TABLE "Memo" ADD COLUMN     "extraDiscount" DOUBLE PRECISION DEFAULT 0,
ALTER COLUMN "discount" DROP NOT NULL;
