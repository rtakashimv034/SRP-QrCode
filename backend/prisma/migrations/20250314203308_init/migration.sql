/*
  Warnings:

  - Added the required column `amountTrays` to the `sectors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sectors" ADD COLUMN     "amountTrays" INTEGER NOT NULL;
