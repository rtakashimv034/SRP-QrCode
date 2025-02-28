/*
  Warnings:

  - You are about to drop the column `sector` on the `workstations` table. All the data in the column will be lost.
  - Added the required column `surname` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sectorName` to the `workstations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "surname" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "workstations" DROP COLUMN "sector",
ADD COLUMN     "sectorName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Sectors" (
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sectors_pkey" PRIMARY KEY ("name")
);

-- AddForeignKey
ALTER TABLE "workstations" ADD CONSTRAINT "workstations_sectorName_fkey" FOREIGN KEY ("sectorName") REFERENCES "Sectors"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
