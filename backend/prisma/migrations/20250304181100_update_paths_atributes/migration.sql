-- DropForeignKey
ALTER TABLE "defective_paths" DROP CONSTRAINT "defective_paths_sectorsName_fkey";

-- DropForeignKey
ALTER TABLE "defective_paths" DROP CONSTRAINT "defective_paths_stationId_fkey";

-- DropForeignKey
ALTER TABLE "paths" DROP CONSTRAINT "paths_sectorsName_fkey";

-- DropForeignKey
ALTER TABLE "paths" DROP CONSTRAINT "paths_stationId_fkey";

-- AlterTable
ALTER TABLE "defective_paths" ALTER COLUMN "stationId" DROP NOT NULL,
ALTER COLUMN "sectorsName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "paths" ALTER COLUMN "stationId" DROP NOT NULL,
ALTER COLUMN "sectorsName" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "paths" ADD CONSTRAINT "paths_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "workstations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paths" ADD CONSTRAINT "paths_sectorsName_fkey" FOREIGN KEY ("sectorsName") REFERENCES "sectors"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defective_paths" ADD CONSTRAINT "defective_paths_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "workstations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defective_paths" ADD CONSTRAINT "defective_paths_sectorsName_fkey" FOREIGN KEY ("sectorsName") REFERENCES "sectors"("name") ON DELETE SET NULL ON UPDATE CASCADE;
