/*
  Warnings:

  - The primary key for the `defective_paths` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `defective_paths` table. All the data in the column will be lost.
  - You are about to drop the column `registeredAt` on the `defective_paths` table. All the data in the column will be lost.
  - The primary key for the `paths` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `paths` table. All the data in the column will be lost.
  - You are about to drop the column `registeredAt` on the `paths` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "defective_paths" DROP CONSTRAINT "defective_paths_pkey",
DROP COLUMN "id",
DROP COLUMN "registeredAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "defective_paths_pkey" PRIMARY KEY ("stationId", "defProdId", "sectorName");

-- AlterTable
ALTER TABLE "paths" DROP CONSTRAINT "paths_pkey",
DROP COLUMN "id",
DROP COLUMN "registeredAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "paths_pkey" PRIMARY KEY ("stationId", "prodSN", "sectorName");
