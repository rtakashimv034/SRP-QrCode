/*
  Warnings:

  - You are about to drop the column `slug` on the `sectors` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `workstations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sectors" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "workstations" DROP COLUMN "description",
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '';
