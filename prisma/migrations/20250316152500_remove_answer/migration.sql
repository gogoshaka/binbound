/*
  Warnings:

  - You are about to drop the column `answer` on the `Question` table. All the data in the column will be lost.
  - Added the required column `answer` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Answer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "answeredByUserPublicProfileId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answeredAtUTC" DATETIME NOT NULL,
    "answer" TEXT NOT NULL,
    CONSTRAINT "Answer_answeredByUserPublicProfileId_fkey" FOREIGN KEY ("answeredByUserPublicProfileId") REFERENCES "UserPublicProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Answer" ("answeredAtUTC", "answeredByUserPublicProfileId", "id", "questionId") SELECT "answeredAtUTC", "answeredByUserPublicProfileId", "id", "questionId" FROM "Answer";
DROP TABLE "Answer";
ALTER TABLE "new_Answer" RENAME TO "Answer";
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "askedByUserPublicProfileId" TEXT NOT NULL,
    "askedAtUTC" DATETIME NOT NULL,
    "validated" BOOLEAN NOT NULL,
    CONSTRAINT "Question_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Question_askedByUserPublicProfileId_fkey" FOREIGN KEY ("askedByUserPublicProfileId") REFERENCES "UserPublicProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("askedAtUTC", "askedByUserPublicProfileId", "eventId", "id", "question", "validated") SELECT "askedAtUTC", "askedByUserPublicProfileId", "eventId", "id", "question", "validated" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
