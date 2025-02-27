/*
  Warnings:

  - You are about to drop the column `isDisposal` on the `workstations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "workstations" DROP COLUMN "isDisposal",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'normal';
