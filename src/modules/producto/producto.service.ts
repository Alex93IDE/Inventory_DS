import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductoDto } from './dto/create-producto.dto';

@Injectable()
export class ProductoService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductoDto, userId: string) {
    return await this.prisma.producto.create({
      data: {
        ...data,
        ownerId: userId,
      },
    });
  }
  async findAll(userId: string) {
    const productos = await this.prisma.producto.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'asc' },
    });

    if (!productos.length) return [];

    const lotes = await this.prisma.lote.findMany({
      where: { ownerId: userId },
      select: {
        productoId: true,
        qty_available: true,
        unit_cost: true,
      },
    });

    const stockMap = new Map<string, number>();
    const costoMap = new Map<string, number>();

    for (const lote of lotes) {
      const stock = lote.qty_available;
      const value = lote.qty_available * Number(lote.unit_cost);

      stockMap.set(
        lote.productoId,
        (stockMap.get(lote.productoId) || 0) + stock,
      );

      costoMap.set(
        lote.productoId,
        Number(((costoMap.get(lote.productoId) || 0) + value).toFixed(2)),
      );
    }

    return productos.map((producto) => ({
      ...producto,
      stock_total: stockMap.get(producto.id) ?? 0,
      costo_total: costoMap.get(producto.id) ?? 0,
    }));
  }

  async remove(id: string, userId: string) {
    const producto = await this.prisma.producto.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });

    if (!producto) {
      throw new NotFoundException('Producto not found');
    }

    await this.prisma.producto.delete({
      where: { id: producto.id },
    });

    return { message: 'Producto deleted successfully' };
  }
}
