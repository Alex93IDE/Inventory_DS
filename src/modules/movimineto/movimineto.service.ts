import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovimientoDto } from './dto/create-movimineto.dto';

@Injectable()
export class MoviminetoService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMovimientoDto, userId: string) {
    return await this.prisma.$transaction(async (tx) => {
      if (dto.type === 'OUT') {
        // 1️⃣ Buscar lotes FIFO
        const lotes = await tx.lote.findMany({
          where: {
            sku: dto.sku,
            ownerId: userId,
            qty_available: { gt: 0 },
          },
          orderBy: [{ purchase_date: 'asc' }, { createdAt: 'asc' }],
        });

        if (!lotes.length) {
          throw new BadRequestException(
            `No inventory available for SKU: ${dto.sku}`,
          );
        }

        // 2️⃣ Validar inventario total antes de tocar nada
        const totalDisponible = lotes.reduce(
          (sum, lote) => sum + lote.qty_available,
          0,
        );

        if (totalDisponible < dto.qty) {
          throw new BadRequestException('Not enough inventory');
        }

        // 3️⃣ Ejecutar FIFO
        let remaining = dto.qty;
        const movimientosCreados: any[] = [];

        for (const lote of lotes) {
          if (remaining <= 0) break;

          const consume = Math.min(lote.qty_available, remaining);

          // actualizar lote
          await tx.lote.update({
            where: { id: lote.id },
            data: {
              qty_available: {
                decrement: consume,
              },
            },
          });

          // crear movimiento ligado al lote
          const movimiento = await tx.movimiento.create({
            data: {
              ownerId: userId,
              sku: lote.sku,
              type: 'OUT',
              qty: consume,
              loteId: lote.id,
              channel: dto.channel,
              order_ref: dto.order_ref,
            },
          });

          movimientosCreados.push(movimiento);

          remaining -= consume;
        }

        return {
          message: 'OUT movement processed successfully',
          movimientos: movimientosCreados,
        };
      }
      if (dto.type === 'IN') {
        if (!dto.sku) {
          throw new BadRequestException('sku is required for IN movement');
        }

        let remaining = dto.qty;
        const movimientosCreados: any[] = [];

        // 1️⃣ Buscar lotes del SKU en orden LIFO (más nuevo primero)
        const lotes = await tx.lote.findMany({
          where: {
            sku: dto.sku,
            ownerId: userId,
          },
          orderBy: [{ purchase_date: 'desc' }, { createdAt: 'desc' }],
        });

        if (!lotes.length) {
          throw new BadRequestException(`No lots found for SKU: ${dto.sku}`);
        }

        // 2️⃣ Repartir el IN respetando la capacidad de cada lote (qty_inicial)
        for (const lote of lotes) {
          if (remaining <= 0) break;

          const espacioDisponible = lote.qty_inicial - lote.qty_available;

          if (espacioDisponible <= 0) continue;

          const agregar = Math.min(espacioDisponible, remaining);

          // actualizar lote
          await tx.lote.update({
            where: { id: lote.id },
            data: {
              qty_available: {
                increment: agregar,
              },
            },
          });

          // crear movimiento
          const movimiento = await tx.movimiento.create({
            data: {
              ownerId: userId,
              sku: lote.sku,
              type: 'IN',
              qty: agregar,
              loteId: lote.id,
              channel: dto.channel,
              order_ref: dto.order_ref,
            },
          });

          movimientosCreados.push(movimiento);

          remaining -= agregar;
        }

        // 3️⃣ Si aún sobra cantidad, significa que excede la capacidad total de los lotes
        if (remaining > 0) {
          throw new BadRequestException(
            'IN exceeds the available capacity across lots (qty_inicial limit)',
          );
        }

        return {
          message: 'IN movement processed successfully (LIFO)',
          movimientos: movimientosCreados,
        };
      }
      throw new BadRequestException('Invalid movement type');
    });
  }

  async findAll(userId: string) {
    return await this.prisma.movimiento.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async findByLote(loteId: string, userId: string) {
    return await this.prisma.movimiento.findMany({
      where: {
        loteId,
        ownerId: userId,
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async findByProducto(productoId: string, userId: string) {
    return await this.prisma.movimiento.findMany({
      where: {
        ownerId: userId,
        lote: {
          productoId: productoId,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }
}
