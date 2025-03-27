/*
  Warnings:

  - You are about to drop the column `organization` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `who` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `companyUrl` on the `user` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "scheduledAt" DATETIME NOT NULL
);
INSERT INTO "new_Event" ("description", "id", "scheduledAt") SELECT "description", "id", "scheduledAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "linkedinUrl" TEXT,
    "twitterUrl" TEXT,
    "githubUrl" TEXT,
    "youtubeUrl" TEXT,
    "organizationName" TEXT,
    "organizationUrl" TEXT
);
INSERT INTO "new_user" ("createdAt", "email", "emailVerified", "githubUrl", "id", "image", "linkedinUrl", "name", "twitterUrl", "updatedAt", "youtubeUrl") SELECT "createdAt", "email", "emailVerified", "githubUrl", "id", "image", "linkedinUrl", "name", "twitterUrl", "updatedAt", "youtubeUrl" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
