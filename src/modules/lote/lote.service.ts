import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LoteService {
  constructor(private prisma: PrismaService) {}

  async test() {
    return await this.prisma.lote.findMany();
    //return console.log('data', process.env.DATABASE_URL);
  }
}
