/*
  Warnings:

  - The primary key for the `defective_paths` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `paths` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `sectorName` to the `defective_paths` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sectorName` to the `paths` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "defective_paths" DROP CONSTRAINT "defective_paths_pkey",
ADD COLUMN     "sectorName" TEXT NOT NULL,
ADD CONSTRAINT "defective_paths_pkey" PRIMARY KEY ("stationId", "defProdId", "sectorName");

-- AlterTable
ALTER TABLE "paths" DROP CONSTRAINT "paths_pkey",
ADD COLUMN     "sectorName" TEXT NOT NULL,
ADD CONSTRAINT "paths_pkey" PRIMARY KEY ("stationId", "prodSN", "sectorName");

-- AddForeignKey
ALTER TABLE "paths" ADD CONSTRAINT "paths_sectorName_fkey" FOREIGN KEY ("sectorName") REFERENCES "sectors"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defective_paths" ADD CONSTRAINT "defective_paths_sectorName_fkey" FOREIGN KEY ("sectorName") REFERENCES "sectors"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
