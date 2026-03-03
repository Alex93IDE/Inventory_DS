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
      orderBy: { createdAt: 'desc' },
    });
    if (!productos.length) return [];
    const stockPorProducto = await this.prisma.lote.groupBy({
      by: ['productoId'],
      where: {
        ownerId: userId,
      },
      _sum: {
        qty_available: true,
      },
    });
    const stockMap = new Map(
      stockPorProducto.map((item) => [
        item.productoId,
        item._sum.qty_available ?? 0,
      ]),
    );

    // 4️⃣ Unir resultados
    return productos.map((producto) => ({
      ...producto,
      stock_total: stockMap.get(producto.id) ?? 0,
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
