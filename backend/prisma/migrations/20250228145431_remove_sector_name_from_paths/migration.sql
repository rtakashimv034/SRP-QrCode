/*
  Warnings:

  - The primary key for the `defective_paths` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sectorName` on the `defective_paths` table. All the data in the column will be lost.
  - The primary key for the `paths` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sectorName` on the `paths` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "defective_paths" DROP CONSTRAINT "defective_paths_sectorName_fkey";

-- DropForeignKey
ALTER TABLE "paths" DROP CONSTRAINT "paths_sectorName_fkey";

-- AlterTable
ALTER TABLE "defective_paths" DROP CONSTRAINT "defective_paths_pkey",
DROP COLUMN "sectorName",
ADD COLUMN     "sectorsName" TEXT,
ADD CONSTRAINT "defective_paths_pkey" PRIMARY KEY ("stationId", "defProdId");

-- AlterTable
ALTER TABLE "paths" DROP CONSTRAINT "paths_pkey",
DROP COLUMN "sectorName",
ADD COLUMN     "sectorsName" TEXT,
ADD CONSTRAINT "paths_pkey" PRIMARY KEY ("stationId", "prodSN");

-- AddForeignKey
ALTER TABLE "paths" ADD CONSTRAINT "paths_sectorsName_fkey" FOREIGN KEY ("sectorsName") REFERENCES "sectors"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defective_paths" ADD CONSTRAINT "defective_paths_sectorsName_fkey" FOREIGN KEY ("sectorsName") REFERENCES "sectors"("name") ON DELETE SET NULL ON UPDATE CASCADE;
