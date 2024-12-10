-- CreateTable
CREATE TABLE "ReferralPayment" (
    "id" TEXT NOT NULL,
    "referredById" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferralPayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReferralPayment" ADD CONSTRAINT "ReferralPayment_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "ReferredBy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
