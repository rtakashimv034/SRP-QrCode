-- CreateTable
CREATE TABLE "workstations" (
    "id" SERIAL NOT NULL,
    "sector" TEXT NOT NULL,
    "isDisposal" BOOLEAN NOT NULL DEFAULT false,
    "qrcode" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workstations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Products" (
    "SN" TEXT NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("SN")
);

-- CreateTable
CREATE TABLE "DefectiveProducts" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "DefectiveProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trays" (
    "id" SERIAL NOT NULL,
    "qrcode" TEXT NOT NULL,

    CONSTRAINT "Trays_pkey" PRIMARY KEY ("id")
);
