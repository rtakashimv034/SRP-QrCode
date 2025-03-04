/*
  Warnings:

  - The primary key for the `defective_paths` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `paths` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `registeredAt` on table `defective_paths` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sectorsName` on table `defective_paths` required. This step will fail if there are existing NULL values in that column.
  - Made the column `registeredAt` on table `paths` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sectorsName` on table `paths` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `sectors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `workstations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "defective_paths" DROP CONSTRAINT "defective_paths_sectorsName_fkey";

-- DropForeignKey
ALTER TABLE "paths" DROP CONSTRAINT "paths_sectorsName_fkey";

-- AlterTable
ALTER TABLE "defective_paths" DROP CONSTRAINT "defective_paths_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "registeredAt" SET NOT NULL,
ALTER COLUMN "sectorsName" SET NOT NULL,
ADD CONSTRAINT "defective_paths_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "paths" DROP CONSTRAINT "paths_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "registeredAt" SET NOT NULL,
ALTER COLUMN "sectorsName" SET NOT NULL,
ADD CONSTRAINT "paths_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "sectors" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "workstations" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "paths" ADD CONSTRAINT "paths_sectorsName_fkey" FOREIGN KEY ("sectorsName") REFERENCES "sectors"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defective_paths" ADD CONSTRAINT "defective_paths_sectorsName_fkey" FOREIGN KEY ("sectorsName") REFERENCES "sectors"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
