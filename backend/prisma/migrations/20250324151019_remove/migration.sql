-- AlterTable
ALTER TABLE "defective_paths" ALTER COLUMN "registeredAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "defective_products" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "paths" ALTER COLUMN "registeredAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "createdAt" DROP DEFAULT;
