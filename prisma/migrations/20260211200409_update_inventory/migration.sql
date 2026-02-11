/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,lote_id]` on the table `Lote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Lote_lote_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Lote_ownerId_lote_id_key" ON "Lote"("ownerId", "lote_id");
