/*
  Warnings:

  - You are about to alter the column `submittedAtUTC` on the `Link` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Link" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submittedByUserPublicProfileId" TEXT NOT NULL,
    "submittedAtUTC" DATETIME NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "upVoteCount" INTEGER NOT NULL,
    "downVoteCount" INTEGER NOT NULL,
    CONSTRAINT "Link_submittedByUserPublicProfileId_fkey" FOREIGN KEY ("submittedByUserPublicProfileId") REFERENCES "UserPublicProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Link" ("downVoteCount", "id", "submittedAtUTC", "submittedByUserPublicProfileId", "title", "upVoteCount", "url") SELECT "downVoteCount", "id", "submittedAtUTC", "submittedByUserPublicProfileId", "title", "upVoteCount", "url" FROM "Link";
DROP TABLE "Link";
ALTER TABLE "new_Link" RENAME TO "Link";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
