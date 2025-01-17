/*
  Warnings:

  - You are about to drop the `DefectiveProducts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Trays` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "DefectiveProducts";

-- DropTable
DROP TABLE "Products";

-- DropTable
DROP TABLE "Trays";

-- CreateTable
CREATE TABLE "products" (
    "SN" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("SN")
);

-- CreateTable
CREATE TABLE "defective_products" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "defective_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trays" (
    "id" SERIAL NOT NULL,
    "qrcode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paths" (
    "stationId" INTEGER NOT NULL,
    "prodSN" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paths_pkey" PRIMARY KEY ("stationId","prodSN")
);

-- CreateTable
CREATE TABLE "defective_paths" (
    "stationId" INTEGER NOT NULL,
    "defProdId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "defective_paths_pkey" PRIMARY KEY ("stationId","defProdId")
);

-- AddForeignKey
ALTER TABLE "paths" ADD CONSTRAINT "paths_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "workstations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paths" ADD CONSTRAINT "paths_prodSN_fkey" FOREIGN KEY ("prodSN") REFERENCES "products"("SN") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defective_paths" ADD CONSTRAINT "defective_paths_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "workstations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defective_paths" ADD CONSTRAINT "defective_paths_defProdId_fkey" FOREIGN KEY ("defProdId") REFERENCES "defective_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
