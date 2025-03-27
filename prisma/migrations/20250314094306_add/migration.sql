/*
  Warnings:

  - You are about to drop the `_QuestionVotedByUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_QuestionVotedByUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_QuestionVotedByUserPublicProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_QuestionVotedByUserPublicProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_QuestionVotedByUserPublicProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "UserPublicProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_QuestionVotedByUserPublicProfile_AB_unique" ON "_QuestionVotedByUserPublicProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_QuestionVotedByUserPublicProfile_B_index" ON "_QuestionVotedByUserPublicProfile"("B");
