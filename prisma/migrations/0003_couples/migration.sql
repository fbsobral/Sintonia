-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CYCLE', 'PARTNER');

-- CreateTable
CREATE TABLE "Couple" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shareCycle" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Couple_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "User" ADD COLUMN "role" "Role",
ADD COLUMN "coupleId" TEXT,
ADD COLUMN "onboardedAt" TIMESTAMP(3),
ADD COLUMN "notifyEvents" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "Partner" ADD COLUMN "coupleId" TEXT;
ALTER TABLE "Cycle" ADD COLUMN "createdById" TEXT;

-- Migração dos dados existentes: um casal por perfil já cadastrado.
-- Quem cadastrou (usuário atual) vira PARTNER (quem acompanha).
INSERT INTO "Couple" ("id") SELECT 'cpl_' || "id" FROM "Partner";
UPDATE "Partner" SET "coupleId" = 'cpl_' || "id";
UPDATE "User" u SET "coupleId" = p."coupleId", "role" = 'PARTNER', "onboardedAt" = CURRENT_TIMESTAMP
  FROM "Partner" p WHERE p."userId" = u."id";

ALTER TABLE "Partner" ALTER COLUMN "coupleId" SET NOT NULL;
ALTER TABLE "Partner" DROP CONSTRAINT "Partner_userId_fkey";
DROP INDEX "Partner_userId_key";
ALTER TABLE "Partner" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "invitedById" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "email" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "acceptedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckIn" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "moods" TEXT[],
    "symptoms" TEXT[],
    "flow" TEXT,
    "libido" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Signal" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "seenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Signal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "User_coupleId_idx" ON "User"("coupleId");
CREATE UNIQUE INDEX "Partner_coupleId_key" ON "Partner"("coupleId");
CREATE UNIQUE INDEX "Invite_token_key" ON "Invite"("token");
CREATE INDEX "Invite_coupleId_idx" ON "Invite"("coupleId");
CREATE UNIQUE INDEX "CheckIn_coupleId_date_key" ON "CheckIn"("coupleId", "date");
CREATE INDEX "Signal_coupleId_date_idx" ON "Signal"("coupleId", "date");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Signal" ADD CONSTRAINT "Signal_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;
