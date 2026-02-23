-- DropForeignKey
ALTER TABLE "Movimiento" DROP CONSTRAINT "Movimiento_loteId_fkey";

-- AddForeignKey
ALTER TABLE "Movimiento" ADD CONSTRAINT "Movimiento_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
