-- AlterTable
ALTER TABLE "User" ADD COLUMN "tours" TEXT[] DEFAULT ARRAY[]::TEXT[];
