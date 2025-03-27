-- AlterTable
ALTER TABLE "user" ADD COLUMN "companyUrl" TEXT;
ALTER TABLE "user" ADD COLUMN "githubUrl" TEXT;
ALTER TABLE "user" ADD COLUMN "linkedinUrl" TEXT;
ALTER TABLE "user" ADD COLUMN "twitterUrl" TEXT;
ALTER TABLE "user" ADD COLUMN "youtubeUrl" TEXT;

-- CreateTable
CREATE TABLE "Guest" (
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "presentationOrder" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "eventId"),
    CONSTRAINT "Guest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Guest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
