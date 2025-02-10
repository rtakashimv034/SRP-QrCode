/*
  Warnings:

  - You are about to drop the `Sectors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "workstations" DROP CONSTRAINT "workstations_sectorName_fkey";

-- DropTable
DROP TABLE "Sectors";

-- CreateTable
CREATE TABLE "sectors" (
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sectors_pkey" PRIMARY KEY ("name")
);

-- AddForeignKey
ALTER TABLE "workstations" ADD CONSTRAINT "workstations_sectorName_fkey" FOREIGN KEY ("sectorName") REFERENCES "sectors"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
