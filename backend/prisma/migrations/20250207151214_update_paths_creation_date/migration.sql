-- AlterTable
ALTER TABLE "defective_paths" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "paths" ALTER COLUMN "createdAt" DROP NOT NULL;
