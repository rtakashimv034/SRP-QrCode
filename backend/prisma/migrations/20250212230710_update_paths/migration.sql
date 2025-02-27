/*
  Warnings:

  - The primary key for the `defective_paths` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `paths` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "defective_paths" DROP CONSTRAINT "defective_paths_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "defective_paths_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "paths" DROP CONSTRAINT "paths_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "paths_pkey" PRIMARY KEY ("id");
