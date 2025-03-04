/*
  Warnings:

  - Made the column `description` on table `workstations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "workstations" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "type" DROP DEFAULT;
