/*
  Warnings:

  - You are about to drop the column `sectorId` on the `defective_paths` table. All the data in the column will be lost.
  - You are about to drop the column `sectorId` on the `paths` table. All the data in the column will be lost.
  - You are about to drop the column `sectorId` on the `workstations` table. All the data in the column will be lost.
  - Added the required column `sectorName` to the `workstations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "defective_paths" DROP CONSTRAINT "defective_paths_sectorId_fkey";

-- DropForeignKey
ALTER TABLE "paths" DROP CONSTRAINT "paths_sectorId_fkey";

-- DropForeignKey
ALTER TABLE "workstations" DROP CONSTRAINT "workstations_sectorId_fkey";

-- AlterTable
ALTER TABLE "defective_paths" DROP COLUMN "sectorId",
ADD COLUMN     "sectorName" TEXT;

-- AlterTable
ALTER TABLE "paths" DROP COLUMN "sectorId",
ADD COLUMN     "sectorName" TEXT;

-- AlterTable
ALTER TABLE "workstations" DROP COLUMN "sectorId",
ADD COLUMN     "sectorName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "workstations" ADD CONSTRAINT "workstations_sectorName_fkey" FOREIGN KEY ("sectorName") REFERENCES "sectors"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paths" ADD CONSTRAINT "paths_sectorName_fkey" FOREIGN KEY ("sectorName") REFERENCES "sectors"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defective_paths" ADD CONSTRAINT "defective_paths_sectorName_fkey" FOREIGN KEY ("sectorName") REFERENCES "sectors"("name") ON DELETE SET NULL ON UPDATE CASCADE;
