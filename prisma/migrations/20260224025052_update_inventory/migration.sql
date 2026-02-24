/*
  Warnings:

  - Added the required column `productoId` to the `Lote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lote" ADD COLUMN     "productoId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "asin" TEXT,
    "upc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Producto_ownerId_idx" ON "Producto"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_ownerId_sku_key" ON "Producto"("ownerId", "sku");

-- AddForeignKey
ALTER TABLE "Lote" ADD CONSTRAINT "Lote_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
