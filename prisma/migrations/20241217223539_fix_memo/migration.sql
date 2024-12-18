-- CreateTable
CREATE TABLE "_MemoTest" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MemoTest_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MemoTest_B_index" ON "_MemoTest"("B");

-- AddForeignKey
ALTER TABLE "_MemoTest" ADD CONSTRAINT "_MemoTest_A_fkey" FOREIGN KEY ("A") REFERENCES "Memo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemoTest" ADD CONSTRAINT "_MemoTest_B_fkey" FOREIGN KEY ("B") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;
