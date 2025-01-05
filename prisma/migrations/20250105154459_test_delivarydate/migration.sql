-- AlterTable
ALTER TABLE "ReferredBy" ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "deliveryDate" TEXT;
