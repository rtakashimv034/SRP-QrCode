/*
  Warnings:

  - You are about to drop the column `isSupervisor` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "isSupervisor",
ADD COLUMN     "isManager" BOOLEAN NOT NULL DEFAULT false;
