-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('IN', 'OUT');

-- CreateTable
CREATE TABLE "Lote" (
    "id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL,
    "qty_inicial" INTEGER NOT NULL,
    "qty_available" INTEGER NOT NULL,
    "unit_cost" DECIMAL(10,2) NOT NULL,
    "total_cost" DECIMAL(12,2) NOT NULL,
    "place" TEXT,
    "order_ref" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movimiento" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sku" TEXT NOT NULL,
    "type" "MovementType" NOT NULL,
    "qty" INTEGER NOT NULL,
    "channel" TEXT,
    "order_ref" TEXT,
    "loteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Movimiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lote_lote_id_key" ON "Lote"("lote_id");

-- CreateIndex
CREATE INDEX "Lote_sku_idx" ON "Lote"("sku");

-- CreateIndex
CREATE INDEX "Lote_purchase_date_idx" ON "Lote"("purchase_date");

-- CreateIndex
CREATE INDEX "Movimiento_sku_idx" ON "Movimiento"("sku");

-- CreateIndex
CREATE INDEX "Movimiento_loteId_idx" ON "Movimiento"("loteId");

-- AddForeignKey
ALTER TABLE "Movimiento" ADD CONSTRAINT "Movimiento_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
