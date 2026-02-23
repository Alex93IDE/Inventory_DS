import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovimientoDto } from './dto/create-movimineto.dto';

@Injectable()
export class MoviminetoService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMovimientoDto, userId: string) {
    if (dto.type !== 'OUT') {
      throw new BadRequestException('Only OUT movements allowed');
    }
    return await this.prisma.$transaction(async (tx) => {
      // 1️⃣ Buscar lotes FIFO
      const lotes = await tx.lote.findMany({
        where: {
          sku: dto.sku,
          ownerId: userId,
          qty_available: { gt: 0 },
        },
        orderBy: {
          purchase_date: 'asc',
        },
      });

      if (!lotes.length) {
        throw new BadRequestException('No inventory available');
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
}
