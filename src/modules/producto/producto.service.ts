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
    return await this.prisma.producto.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
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
