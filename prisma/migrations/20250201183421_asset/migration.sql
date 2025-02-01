-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "img" TEXT,
ALTER COLUMN "purchasedBy" DROP NOT NULL;
