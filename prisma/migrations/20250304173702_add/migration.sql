-- CreateTable
CREATE TABLE "_QuestionVotedByUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_QuestionVotedByUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_QuestionVotedByUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_QuestionVotedByUser_AB_unique" ON "_QuestionVotedByUser"("A", "B");

-- CreateIndex
CREATE INDEX "_QuestionVotedByUser_B_index" ON "_QuestionVotedByUser"("B");
