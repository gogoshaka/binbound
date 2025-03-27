/*
  Warnings:

  - You are about to drop the column `answer` on the `Answer` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Answer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "answeredByUserPublicProfileId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answeredAtUTC" DATETIME NOT NULL,
    CONSTRAINT "Answer_answeredByUserPublicProfileId_fkey" FOREIGN KEY ("answeredByUserPublicProfileId") REFERENCES "UserPublicProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Answer" ("answeredAtUTC", "answeredByUserPublicProfileId", "id", "questionId") SELECT "answeredAtUTC", "answeredByUserPublicProfileId", "id", "questionId" FROM "Answer";
DROP TABLE "Answer";
ALTER TABLE "new_Answer" RENAME TO "Answer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
