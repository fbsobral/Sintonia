-- AlterTable
ALTER TABLE "User" ADD COLUMN "emailOnlyChanges" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "lastStageKey" TEXT;
