/*
  Warnings:

  - You are about to drop the column `scheduledAt` on the `Event` table. All the data in the column will be lost.
  - The primary key for the `Guest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `askedAt` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `askedByUserId` on the `Question` table. All the data in the column will be lost.
  - Added the required column `scheduledAtUTC` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userPublicProfileId` to the `Guest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `askedAtUTC` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `askedByUserPublicProfileId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scheduledAtUTC" DATETIME NOT NULL
);
INSERT INTO "new_Event" ("description", "id", "title") SELECT "description", "id", "title" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_Guest" (
    "userPublicProfileId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "presentationOrder" INTEGER NOT NULL,

    PRIMARY KEY ("userPublicProfileId", "eventId"),
    CONSTRAINT "Guest_userPublicProfileId_fkey" FOREIGN KEY ("userPublicProfileId") REFERENCES "UserPublicProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Guest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Guest" ("eventId", "presentationOrder") SELECT "eventId", "presentationOrder" FROM "Guest";
DROP TABLE "Guest";
ALTER TABLE "new_Guest" RENAME TO "Guest";
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "askedByUserPublicProfileId" TEXT NOT NULL,
    "askedAtUTC" DATETIME NOT NULL,
    "validated" BOOLEAN NOT NULL,
    CONSTRAINT "Question_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Question_askedByUserPublicProfileId_fkey" FOREIGN KEY ("askedByUserPublicProfileId") REFERENCES "UserPublicProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("answer", "eventId", "id", "question", "validated") SELECT "answer", "eventId", "id", "question", "validated" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
