import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLoteDto } from './dto/create-lote.dto';

@Injectable()
export class LoteService {
  constructor(private prisma: PrismaService) {}

  parseMMDDYYYY(dateString: string): Date {
    const [month, day, year] = dateString.split('-');
    return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  }

  async create(data: CreateLoteDto, userId: string) {
    return await this.prisma.lote.create({
      data: {
        ...data,
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
}
