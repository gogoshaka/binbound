/*
  Warnings:

  - You are about to drop the column `githubUrl` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `linkedinUrl` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `organizationName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `organizationUrl` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `twitterUrl` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `youtubeUrl` on the `user` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "UserPublicProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "linkedinUrl" TEXT,
    "twitterUrl" TEXT,
    "githubUrl" TEXT,
    "youtubeUrl" TEXT,
    "position" TEXT,
    "organizationName" TEXT,
    "organizationUrl" TEXT,
    "bio" TEXT,
    "personalWebsite" TEXT,
    "pictureUrl" TEXT,
    CONSTRAINT "UserPublicProfile_id_name_fkey" FOREIGN KEY ("id", "name") REFERENCES "user" ("id", "name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guest" (
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "presentationOrder" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "eventId"),
    CONSTRAINT "Guest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserPublicProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Guest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Guest" ("eventId", "presentationOrder", "userId") SELECT "eventId", "presentationOrder", "userId" FROM "Guest";
DROP TABLE "Guest";
ALTER TABLE "new_Guest" RENAME TO "Guest";
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "askedByUserId" TEXT NOT NULL,
    "askedAt" DATETIME NOT NULL,
    "validated" BOOLEAN NOT NULL,
    CONSTRAINT "Question_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Question_askedByUserId_fkey" FOREIGN KEY ("askedByUserId") REFERENCES "UserPublicProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("answer", "askedAt", "askedByUserId", "eventId", "id", "question", "validated") SELECT "answer", "askedAt", "askedByUserId", "eventId", "id", "question", "validated" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE TABLE "new__JoinedEvents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_JoinedEvents_A_fkey" FOREIGN KEY ("A") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_JoinedEvents_B_fkey" FOREIGN KEY ("B") REFERENCES "UserPublicProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__JoinedEvents" ("A", "B") SELECT "A", "B" FROM "_JoinedEvents";
DROP TABLE "_JoinedEvents";
ALTER TABLE "new__JoinedEvents" RENAME TO "_JoinedEvents";
CREATE UNIQUE INDEX "_JoinedEvents_AB_unique" ON "_JoinedEvents"("A", "B");
CREATE INDEX "_JoinedEvents_B_index" ON "_JoinedEvents"("B");
CREATE TABLE "new__QuestionVotedByUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_QuestionVotedByUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_QuestionVotedByUser_B_fkey" FOREIGN KEY ("B") REFERENCES "UserPublicProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__QuestionVotedByUser" ("A", "B") SELECT "A", "B" FROM "_QuestionVotedByUser";
DROP TABLE "_QuestionVotedByUser";
ALTER TABLE "new__QuestionVotedByUser" RENAME TO "_QuestionVotedByUser";
CREATE UNIQUE INDEX "_QuestionVotedByUser_AB_unique" ON "_QuestionVotedByUser"("A", "B");
CREATE INDEX "_QuestionVotedByUser_B_index" ON "_QuestionVotedByUser"("B");
CREATE TABLE "new__RegisteredEvents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_RegisteredEvents_A_fkey" FOREIGN KEY ("A") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RegisteredEvents_B_fkey" FOREIGN KEY ("B") REFERENCES "UserPublicProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__RegisteredEvents" ("A", "B") SELECT "A", "B" FROM "_RegisteredEvents";
DROP TABLE "_RegisteredEvents";
ALTER TABLE "new__RegisteredEvents" RENAME TO "_RegisteredEvents";
CREATE UNIQUE INDEX "_RegisteredEvents_AB_unique" ON "_RegisteredEvents"("A", "B");
CREATE INDEX "_RegisteredEvents_B_index" ON "_RegisteredEvents"("B");
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_user" ("createdAt", "email", "emailVerified", "id", "image", "name", "updatedAt") SELECT "createdAt", "email", "emailVerified", "id", "image", "name", "updatedAt" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
CREATE UNIQUE INDEX "user_name_key" ON "user"("name");
CREATE UNIQUE INDEX "user_id_name_key" ON "user"("id", "name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "UserPublicProfile_id_name_key" ON "UserPublicProfile"("id", "name");
