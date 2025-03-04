/*
  Warnings:

  - You are about to drop the column `qrcode` on the `trays` table. All the data in the column will be lost.
  - You are about to drop the column `qrcode` on the `workstations` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "trays_qrcode_key";

-- DropIndex
DROP INDEX "workstations_qrcode_key";

-- AlterTable
ALTER TABLE "trays" DROP COLUMN "qrcode";

-- AlterTable
ALTER TABLE "workstations" DROP COLUMN "qrcode";
