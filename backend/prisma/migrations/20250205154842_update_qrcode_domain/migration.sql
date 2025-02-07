/*
  Warnings:

  - A unique constraint covering the columns `[qrcode]` on the table `trays` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[qrcode]` on the table `workstations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "trays_qrcode_key" ON "trays"("qrcode");

-- CreateIndex
CREATE UNIQUE INDEX "workstations_qrcode_key" ON "workstations"("qrcode");
