-- CreateTable
CREATE TABLE "LinkVote" (
    "userPublicProfileId" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "upVote" BOOLEAN NOT NULL,

    PRIMARY KEY ("userPublicProfileId", "linkId"),
    CONSTRAINT "LinkVote_userPublicProfileId_fkey" FOREIGN KEY ("userPublicProfileId") REFERENCES "UserPublicProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LinkVote_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submittedByUserPublicProfileId" TEXT NOT NULL,
    "submittedAtUTC" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "upVoteCount" INTEGER NOT NULL,
    "downVoteCount" INTEGER NOT NULL,
    CONSTRAINT "Link_submittedByUserPublicProfileId_fkey" FOREIGN KEY ("submittedByUserPublicProfileId") REFERENCES "UserPublicProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_LinkToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_LinkToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Link" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LinkToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_LinkToTag_AB_unique" ON "_LinkToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_LinkToTag_B_index" ON "_LinkToTag"("B");
