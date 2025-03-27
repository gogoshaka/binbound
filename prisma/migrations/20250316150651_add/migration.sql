-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "answeredByUserPublicProfileId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answeredAtUTC" DATETIME NOT NULL,
    "answer" TEXT NOT NULL,
    CONSTRAINT "Answer_answeredByUserPublicProfileId_fkey" FOREIGN KEY ("answeredByUserPublicProfileId") REFERENCES "UserPublicProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
