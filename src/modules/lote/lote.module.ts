import { Module } from '@nestjs/common';
import { LoteService } from './lote.service';
import { LoteController } from './lote.controller';

@Module({
  providers: [LoteService],
  controllers: [LoteController],
})
export class LoteModule {}
