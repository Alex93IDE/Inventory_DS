/*
  Warnings:

  - Added the required column `ownerId` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Movimiento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lote" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Movimiento" ADD COLUMN     "ownerId" TEXT NOT NULL;
