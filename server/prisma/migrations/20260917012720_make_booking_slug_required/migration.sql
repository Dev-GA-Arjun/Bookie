/*
  Warnings:

  - Made the column `bookingSlug` on table `Business` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "bookingSlug" SET NOT NULL;
