import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';

@Injectable()
export class LoteService {
  constructor(private prisma: PrismaService) {}

  parseMMDDYYYY(dateString: string): Date {
    const [month, day, year] = dateString.split('-');
    return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  }

  async create(data: CreateLoteDto, userId: string) {
    const producto = await this.prisma.producto.findFirst({
      where: {
        id: data.productoId,
        ownerId: userId,
      },
    });

    if (!producto) {
      throw new NotFoundException('Producto not found');
    }

    return await this.prisma.lote.create({
      data: {
        ...data,
        lote_id: data.lote_id + '-' + producto.sku,
        productoId: producto.id,
        sku: producto.sku,
        purchase_date: this.parseMMDDYYYY(data.purchase_date),
        ownerId: userId,
        qty_available: data.qty_inicial,
        total_cost: data.qty_inicial * data.unit_cost,
      },
    });
  }

  async findAll(userId: string) {
    return await this.prisma.lote.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        purchase_date: 'asc',
      },
    });
  }

  async findAllByProducto(productoId: string, userId: string) {
    // Primero validar que el producto pertenece al usuario
    const producto = await this.prisma.producto.findFirst({
      where: {
        id: productoId,
        ownerId: userId,
      },
    });

    if (!producto) {
      throw new NotFoundException('Producto not found');
    }

    return await this.prisma.lote.findMany({
      where: {
        productoId,
        ownerId: userId,
      },
      orderBy: {
        purchase_date: 'asc',
      },
    });
  }

  async removeByLoteId(lote_id: string, userId: string) {
    const lote = await this.prisma.lote.findFirst({
      where: {
        lote_id,
        ownerId: userId,
      },
    });

    if (!lote) {
      throw new NotFoundException('Lote not found');
    }

    await this.prisma.lote.delete({
      where: { id: lote.id },
    });

    return { message: 'Lote deleted successfully' };
  }

  async update(lote_id: string, data: UpdateLoteDto, userId: string) {
    const lote = await this.prisma.lote.findFirst({
      where: {
        lote_id: lote_id,
        ownerId: userId,
      },
    });

    if (!lote) {
      throw new NotFoundException('Lote not found');
    }

    const updateData: any = { ...data };

    // 🔹 Convertir fecha si viene
    if (data.purchase_date) {
      updateData.purchase_date = this.parseMMDDYYYY(data.purchase_date);
    }

    // 🔹 Si cambia qty_inicial
    if (data.qty_inicial !== undefined) {
      const consumido = lote.qty_inicial - lote.qty_available;

      if (data.qty_inicial < consumido) {
        throw new Error(
          'New qty_inicial cannot be less than already consumed quantity',
        );
      }

      updateData.qty_available = data.qty_inicial - consumido;
    }

    // 🔹 Si cambia qty o costo → recalcular total_cost
    if (data.qty_inicial !== undefined || data.unit_cost !== undefined) {
      const newQty = data.qty_inicial ?? lote.qty_inicial;
      const newCost = data.unit_cost ?? lote.unit_cost;

      updateData.total_cost = Number(newQty) * Number(newCost);
    }

    return await this.prisma.lote.update({
      where: { id: lote.id },
      data: updateData,
    });
  }
}
