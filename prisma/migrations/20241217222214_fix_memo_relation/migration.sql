-- DropForeignKey
ALTER TABLE "MemoToTest" DROP CONSTRAINT "MemoToTest_memoId_fkey";

-- CreateTable
CREATE TABLE "_MemoTests" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MemoTests_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MemoTests_B_index" ON "_MemoTests"("B");

-- AddForeignKey
ALTER TABLE "_MemoTests" ADD CONSTRAINT "_MemoTests_A_fkey" FOREIGN KEY ("A") REFERENCES "Memo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemoTests" ADD CONSTRAINT "_MemoTests_B_fkey" FOREIGN KEY ("B") REFERENCES "MemoToTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
