/*
  Warnings:

  - You are about to drop the column `createdAt` on the `defective_paths` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `paths` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "defective_paths" DROP COLUMN "createdAt",
ADD COLUMN     "registeredAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "paths" DROP COLUMN "createdAt",
ADD COLUMN     "registeredAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
