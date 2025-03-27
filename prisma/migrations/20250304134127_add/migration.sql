-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "askedByUserId" TEXT NOT NULL,
    "askedAt" DATETIME NOT NULL,
    "validated" BOOLEAN NOT NULL,
    CONSTRAINT "Question_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Question_askedByUserId_fkey" FOREIGN KEY ("askedByUserId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
